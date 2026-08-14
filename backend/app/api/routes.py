from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.analysis.pipeline import analyze_essay
from app.api.dependencies import current_user
from app.core.config import settings
from app.db.models import Analysis, Essay, SentenceAnalysis as DBSentenceAnalysis, User
from app.db.session import SessionLocal, get_db
from app.models import AnalyzeRequest, AnalysisResult


router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_essay_endpoint(
    request: AnalyzeRequest,
    http_request: Request,
) -> AnalysisResult:
    """Analyze an essay and persist it for the signed-in user when authenticated.

    The detector call and response schema remain unchanged. Authentication and
    persistence are additive: anonymous analysis continues to work.
    """
    db: Session | None = None
    try:
        result = analyze_essay(raw_text=request.essay, model_id=request.model_id)

        # Persistence is additive. Anonymous analysis keeps the existing behavior
        # even when PostgreSQL is not configured/running. Authenticated analysis
        # requires the database because that is where ownership is recorded.
        user_id = http_request.session.get("user_id")
        if user_id:
            db = SessionLocal()
            user = db.get(User, int(user_id))
            if user:
                essay = Essay(
                    user_id=user.id,
                    title=result.title,
                    content=result.rawText,
                    word_count=result.wordCount,
                )
                db.add(essay)
                db.flush()

                result_json = result.model_dump(mode="json")
                scores = [sentence.signalScore for sentence in result.sentences]
                levels = {"none": 0, "yellow": 1, "orange": 2, "red": 3}
                highest_level = max(
                    (sentence.flagLevel for sentence in result.sentences),
                    key=lambda level: levels.get(level, 0),
                    default="none",
                )

                analysis = Analysis(
                    essay_id=essay.id,
                    detector_version=settings.app_version,
                    overall_score=(sum(scores) / len(scores)) if scores else 0.0,
                    flag_level=highest_level,
                    explanation=result.summaryMessage,
                    result_json=result_json,
                )
                db.add(analysis)
                db.flush()

                for sentence in result.sentences:
                    db.add(
                        DBSentenceAnalysis(
                            analysis_id=analysis.id,
                            sentence_index=sentence.index,
                            paragraph_index=sentence.paragraphIndex,
                            text=sentence.text,
                            flag_level=sentence.flagLevel,
                            signal_score=sentence.signalScore,
                            passage_category=sentence.passageCategory,
                            explanation=sentence.summaryExplanation,
                            signals_json=[signal.model_dump(mode="json") for signal in sentence.signals],
                        )
                    )

                db.commit()

        return result

    except ValueError as exc:
        if db is not None:
            db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        if db is not None:
            db.rollback()
        print(f"Analysis error: {exc}")
        raise HTTPException(status_code=500, detail="Essay analysis failed.") from exc
    finally:
        if db is not None:
            db.close()


@router.get("/essays")
async def list_essays(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    essays = db.scalars(
        select(Essay).where(Essay.user_id == user.id).order_by(desc(Essay.created_at))
    ).all()
    return [
        {
            "id": essay.id,
            "title": essay.title,
            "word_count": essay.word_count,
            "created_at": essay.created_at,
            "updated_at": essay.updated_at,
            "analysis_count": len(essay.analyses),
        }
        for essay in essays
    ]

@router.delete("/essays/{essay_id}", status_code=200)
async def delete_essay(
    essay_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Delete one essay owned by the authenticated user."""
    essay = db.scalar(
        select(Essay).where(
            Essay.id == essay_id,
            Essay.user_id == user.id,
        )
    )

    if essay is None:
        raise HTTPException(status_code=404, detail="Essay not found.")

    db.delete(essay)
    db.commit()

    return {"message": "Essay deleted successfully."}

    
@router.get("/essays/{essay_id}")
async def get_essay(
    essay_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    essay = db.scalar(select(Essay).where(Essay.id == essay_id, Essay.user_id == user.id))
    if essay is None:
        raise HTTPException(status_code=404, detail="Essay not found.")

    latest = max(essay.analyses, key=lambda item: item.created_at, default=None)
    return {
        "id": essay.id,
        "title": essay.title,
        "content": essay.content,
        "word_count": essay.word_count,
        "created_at": essay.created_at,
        "updated_at": essay.updated_at,
        "latest_analysis": latest.result_json if latest else None,
    }
