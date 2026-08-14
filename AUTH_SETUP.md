# VeritasAI authentication setup

VeritasAI now supports three sign-in paths:

1. Email + password (local account)
2. Google OAuth
3. GitHub OAuth

Local passwords are never stored in plaintext. They are hashed with Argon2 before being saved in PostgreSQL.

## 1. Apply the credential-auth migration

From `backend/` with the virtual environment active:

```bash
alembic upgrade head
```

This adds `users.password_hash` through migration `0002_credentials`.

## 2. Local email/password login

Open the app at `http://localhost:3000` and choose **Sign up** to create a local account. After registration, the account is saved in PostgreSQL and the session is created by FastAPI.

After that, the same email/password can be used from the normal Sign In form.

You do not need Google or GitHub configuration for this path.

## 3. Google login

Create a Google OAuth 2.0 **Web application** client in Google Cloud Console. Add this exact authorized redirect URI for local development:

```text
http://localhost:8000/api/auth/google/callback
```

Google supports local-machine redirect URIs for web-server OAuth testing. Keep the client secret on the backend only. Do not commit it to Git.

Put the generated values in `backend/.env`:

```text
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

Restart FastAPI after editing `.env`.

## 4. GitHub login

Create a GitHub **OAuth App** for the web application flow. Use:

```text
Application name: VeritasAI Local
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:8000/api/auth/github/callback
```

GitHub's callback URL must match the configured URL for the OAuth application. For the current local setup, use the exact `localhost` URL above.

Put the generated values in `backend/.env`:

```text
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

Restart FastAPI after editing `.env`.

## 5. Session and secrets

Also set a strong local session secret in `backend/.env`:

```text
SESSION_SECRET=replace-this-with-a-long-random-secret
SESSION_HTTPS_ONLY=false
```

Never commit the real `.env` file.

## 6. Expected local flow

```text
Browser (localhost:3000)
        |
        v
Next.js login UI
        |
        +--> Email/password --> FastAPI --> PostgreSQL
        |
        +--> Google ---------> Google --> FastAPI --> PostgreSQL
        |
        +--> GitHub ---------> GitHub --> FastAPI --> PostgreSQL
```

After authentication, the user's `user_id` is stored in the signed FastAPI session. Essays and analyses are then associated with that user.
