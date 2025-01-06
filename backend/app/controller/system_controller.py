from dependencies import get_db
from sqlalchemy.sql import text  
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/health-check")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "details": str(e)}