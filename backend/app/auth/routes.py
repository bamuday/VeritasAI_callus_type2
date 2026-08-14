from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.auth.service import (
    authenticate_credentials,
    create_or_update_credentials_user,
    get_current_user,
    get_oauth_client,
    oauth,
    profile_from_github,
    profile_from_google,
    set_user_session,
    upsert_user,
)
from app.core.config import settings
from app.db.models import User
from app.db.session import get_db


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class CredentialRegisterRequest(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class CredentialLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


def _frontend_redirect(path: str = "/") -> str:
    return f"{settings.frontend_url.rstrip('/')}{path}"


@router.post("/register")
def register_credentials(payload: CredentialRegisterRequest, request: Request, db: Session = Depends(get_db)):
    user = create_or_update_credentials_user(
        db,
        name=payload.name.strip() if payload.name else None,
        email=str(payload.email),
        password=payload.password,
    )
    set_user_session(request, user)
    return {"id": user.id, "name": user.name, "email": user.email, "avatar_url": user.avatar_url, "provider": "credentials"}


@router.post("/login")
def login_credentials(payload: CredentialLoginRequest, request: Request, db: Session = Depends(get_db)):
    user = authenticate_credentials(db, email=str(payload.email), password=payload.password)
    set_user_session(request, user)
    return {"id": user.id, "name": user.name, "email": user.email, "avatar_url": user.avatar_url, "provider": "credentials"}


@router.get("/google")
async def google_login(request: Request):
    client = get_oauth_client("google")
    redirect_uri = settings.google_redirect_uri
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    client = get_oauth_client("google")
    try:
        token = await client.authorize_access_token(request)
        profile = await profile_from_google(token)
        user = upsert_user(db, profile)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Google authentication failed.") from exc

    set_user_session(request, user)
    request.session["auth_provider"] = profile.provider
    return RedirectResponse(_frontend_redirect("/"), status_code=303)


@router.get("/github")
async def github_login(request: Request):
    client = get_oauth_client("github")
    redirect_uri = settings.github_redirect_uri
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    client = get_oauth_client("github")
    try:
        token = await client.authorize_access_token(request)
        profile = await profile_from_github(client, token)
        user = upsert_user(db, profile)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="GitHub authentication failed.") from exc

    set_user_session(request, user)
    request.session["auth_provider"] = profile.provider
    return RedirectResponse(_frontend_redirect("/"), status_code=303)


@router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "provider": request.session.get("auth_provider"),
    }


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"ok": True}
