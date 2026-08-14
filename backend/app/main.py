from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api.routes import router as api_router
from app.auth.routes import router as auth_router
from app.core.config import settings


app = FastAPI(
    title="VeritasAI",
    description="Statistical admissions essay analysis API",
    version=settings.app_version,
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    https_only=settings.session_https_only,
    same_site="lax",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(auth_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "veritasai"}
