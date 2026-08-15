# VeritasAI — Authentication Setup

This document explains the authentication system and how to configure each authentication provider.

---

# 1. Authentication Architecture

VeritasAI supports:

```text
Email + Password
Google OAuth
GitHub OAuth
```

Architecture:

```text
                         Authentication
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        Credentials         Google            GitHub
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                         FastAPI Auth
                               │
                               ▼
                         User / Account
                               │
                               ▼
                       Signed Session
                               │
                               ▼
                          PostgreSQL
```

---

# 2. Backend Files

Authentication code lives in:

```text
backend/app/auth/
├── __init__.py
├── routes.py
└── service.py
```

Configuration:

```text
backend/app/core/config.py
```

Database:

```text
backend/app/db/models.py
```

---

# 3. Email/Password Authentication

Registration endpoint:

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Srinjoy",
  "email": "user@example.com",
  "password": "strong-password"
}
```

Login:

```http
POST /api/auth/login
```

Password handling:

```text
Plain password
      ↓
Argon2 hash
      ↓
Database
```

The plain-text password is not stored.

---

# 4. Password Rules

The current API expects:

```text
Minimum: 8 characters
Maximum: 128 characters
```

Use strong passwords in real deployments.

---

# 5. Current User

Endpoint:

```http
GET /api/auth/me
```

The backend reads the current session and returns the authenticated user.

This is used by the frontend to restore authentication state after page refreshes.

---

# 6. Logout

Endpoint:

```http
POST /api/auth/logout
```

The backend clears the current authenticated session.

---

# 7. Session Configuration

Backend `.env`:

```env
SESSION_SECRET=replace-with-a-long-random-secret
SESSION_HTTPS_ONLY=false
```

Generate a secure secret:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

For production:

```env
SESSION_HTTPS_ONLY=true
```

when the application is served through HTTPS.

---

# 8. Google OAuth

## Create credentials

Create a Google OAuth Web Application.

Use the local callback:

```text
http://localhost:8000/api/auth/google/callback
```

Backend environment:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

# 9. Google Flow

```text
User clicks Google
        │
        ▼
GET /api/auth/google
        │
        ▼
Google authorization
        │
        ▼
GET /api/auth/google/callback
        │
        ▼
Verify profile
        │
        ▼
Create/find User
        │
        ▼
Create session
        │
        ▼
Redirect frontend
```

---

# 10. GitHub OAuth

Create a GitHub OAuth application.

Local configuration:

```text
Homepage:
http://localhost:3000
```

Callback:

```text
http://localhost:8000/api/auth/github/callback
```

Backend `.env`:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback
```

---

# 11. GitHub Flow

```text
User clicks GitHub
        │
        ▼
GET /api/auth/github
        │
        ▼
GitHub authorization
        │
        ▼
GET /api/auth/github/callback
        │
        ▼
Fetch user profile
        │
        ▼
Create/find User
        │
        ▼
Create session
        │
        ▼
Redirect frontend
```

---

# 12. Database Authentication Tables

The main tables are:

```text
users
auth_accounts
```

Conceptually:

```text
User
 │
 ├── Email/password credential
 │
 ├── Google account
 │
 └── GitHub account
```

`auth_accounts` stores provider identity information.

---

# 13. Security Rules

Never commit:

```text
SESSION_SECRET
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_SECRET
DATABASE_URL with production password
```

Never place OAuth client secrets in:

```text
NEXT_PUBLIC_*
```

Frontend variables are exposed to the browser.

---

# 14. OAuth Troubleshooting

If OAuth fails, verify:

```text
1. Client ID is correct.
2. Client secret is correct.
3. Redirect URI matches exactly.
4. Backend .env is loaded.
5. FastAPI was restarted.
6. Frontend URL is correct.
7. Browser is using localhost consistently.
```

Avoid mixing:

```text
localhost
```

and:

```text
127.0.0.1
```

during OAuth testing unless the configured origins/callbacks support both.

---

# 15. Authentication Test Checklist

- [ ] Register a new account.
- [ ] Try duplicate email registration.
- [ ] Login with correct password.
- [ ] Reject incorrect password.
- [ ] Verify `/api/auth/me`.
- [ ] Refresh frontend and verify session persists.
- [ ] Logout.
- [ ] Verify session is cleared.
- [ ] Test Google OAuth if configured.
- [ ] Test GitHub OAuth if configured.
