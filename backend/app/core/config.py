from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """Runtime configuration for VeritasAI."""

    app_name: str = os.getenv("APP_NAME", "VeritasAI Backend")
    app_version: str = os.getenv("APP_VERSION", "1.1.0")
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    model_name: str = os.getenv("MODEL_NAME", "distilgpt2")
    max_model_tokens: int = int(os.getenv("MAX_MODEL_TOKENS", "512"))

    # Database. Local Docker PostgreSQL is the recommended development path.
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://veritasai:veritasai@localhost:5432/veritasai",
    )

    # Session signing. Change this in any non-local environment.
    session_secret: str = os.getenv("SESSION_SECRET", "change-me-in-development")
    session_https_only: bool = os.getenv("SESSION_HTTPS_ONLY", "false").lower() == "true"

    # OAuth application credentials.
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    google_redirect_uri: str = os.getenv(
        "GOOGLE_REDIRECT_URI",
        "http://localhost:8000/api/auth/google/callback",
    )

    github_client_id: str = os.getenv("GITHUB_CLIENT_ID", "")
    github_client_secret: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    github_redirect_uri: str = os.getenv(
        "GITHUB_REDIRECT_URI",
        "http://localhost:8000/api/auth/github/callback",
    )


settings = Settings()
