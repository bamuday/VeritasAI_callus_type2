from __future__ import annotations

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.auth.service import get_current_user
from app.db.models import User
from app.db.session import get_db


def current_user(request: Request, db: Session = Depends(get_db)) -> User:
    return get_current_user(request, db)
