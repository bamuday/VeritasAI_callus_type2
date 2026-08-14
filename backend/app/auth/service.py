from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import AuthAccount, User


@dataclass(frozen=True)
class OAuthProfile:
    provider: str
    provider_account_id: str
    email: str
    name: str | None
    avatar_url: str | None


password_hasher = PasswordHasher()
oauth = OAuth()

if settings.google_client_id and settings.google_client_secret:
    oauth.register(
        name="google",
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        client_kwargs={"scope": "openid email profile"},
    )

if settings.github_client_id and settings.github_client_secret:
    oauth.register(
        name="github",
        client_id=settings.github_client_id,
        client_secret=settings.github_client_secret,
        authorize_url="https://github.com/login/oauth/authorize",
        access_token_url="https://github.com/login/oauth/access_token",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "read:user user:email"},
    )


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password_hash, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def _require_provider_config(provider: str) -> None:
    if provider == "google" and not (settings.google_client_id and settings.google_client_secret):
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google login is not configured.")
    if provider == "github" and not (settings.github_client_id and settings.github_client_secret):
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="GitHub login is not configured.")


def get_oauth_client(provider: str):
    _require_provider_config(provider)
    client = oauth.create_client(provider)
    if client is None:
        raise HTTPException(status_code=503, detail=f"{provider.title()} login is not available.")
    return client


async def profile_from_google(token: dict[str, Any]) -> OAuthProfile:
    userinfo = token.get("userinfo") or {}
    subject = userinfo.get("sub")
    email = userinfo.get("email")
    if not subject or not email or userinfo.get("email_verified") is False:
        raise HTTPException(status_code=400, detail="Google did not return a verified email address.")
    return OAuthProfile("google", str(subject), str(email).lower(), userinfo.get("name"), userinfo.get("picture"))


async def profile_from_github(client, token: dict[str, Any]) -> OAuthProfile:
    response = await client.get("user", token=token)
    response.raise_for_status()
    data = response.json()

    email = data.get("email")
    if not email:
        emails_response = await client.get("user/emails", token=token)
        emails_response.raise_for_status()
        emails = emails_response.json()
        verified_primary = next((item for item in emails if item.get("primary") and item.get("verified")), None)
        email = verified_primary.get("email") if verified_primary else None

    if not data.get("id") or not email:
        raise HTTPException(status_code=400, detail="GitHub did not return a verified email address.")

    return OAuthProfile("github", str(data["id"]), str(email).lower(), data.get("name") or data.get("login"), data.get("avatar_url"))


def upsert_user(db: Session, profile: OAuthProfile) -> User:
    account = db.scalar(
        select(AuthAccount).where(
            AuthAccount.provider == profile.provider,
            AuthAccount.provider_account_id == profile.provider_account_id,
        )
    )
    if account:
        user = account.user
        user.name = profile.name or user.name
        user.avatar_url = profile.avatar_url or user.avatar_url
        db.commit()
        db.refresh(user)
        return user

    user = db.scalar(select(User).where(User.email == profile.email))
    if user is None:
        user = User(email=profile.email, name=profile.name, avatar_url=profile.avatar_url)
        db.add(user)
        db.flush()
    else:
        user.name = profile.name or user.name
        user.avatar_url = profile.avatar_url or user.avatar_url

    db.add(AuthAccount(user_id=user.id, provider=profile.provider, provider_account_id=profile.provider_account_id))
    db.commit()
    db.refresh(user)
    return user


def create_or_update_credentials_user(db: Session, *, name: str | None, email: str, password: str) -> User:
    normalized_email = email.strip().lower()
    user = db.scalar(select(User).where(User.email == normalized_email))
    if user is not None:
        if user.password_hash:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        user.name = name or user.name
        user.password_hash = hash_password(password)
    else:
        user = User(email=normalized_email, name=name, password_hash=hash_password(password))
        db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_credentials(db: Session, *, email: str, password: str) -> User:
    normalized_email = email.strip().lower()
    user = db.scalar(select(User).where(User.email == normalized_email))
    if user is None or not user.password_hash or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    return user


def set_user_session(request: Request, user: User) -> None:
    request.session.clear()
    request.session["user_id"] = user.id
    request.session["auth_provider"] = "credentials"


def get_current_user(request: Request, db: Session) -> User:
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    user = db.get(User, int(user_id))
    if not user:
        request.session.clear()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication session is invalid.")
    return user
