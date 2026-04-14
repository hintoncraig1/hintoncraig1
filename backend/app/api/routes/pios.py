from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.pios_schema import EntryCreate, EntryRead, LedgerEventRead, SummaryRead
from app.services.pios_service import PersonalIntelligenceService

router = APIRouter(prefix="/api/v1/pios", tags=["Personal Intelligence OS"])


@router.post("/entries", summary="Capture entry into vault + ledger")
async def capture_entry(payload: EntryCreate, db: Session = Depends(get_db)):
    service = PersonalIntelligenceService(db)
    entry, ledger_event = service.create_entry(payload)
    return {"entry": entry, "ledgerEvent": ledger_event}


@router.get("/timeline", response_model=list[EntryRead], summary="View chronological memory feed")
async def get_timeline(limit: int = 100, db: Session = Depends(get_db)):
    service = PersonalIntelligenceService(db)
    return service.timeline(limit=limit)


@router.get("/ledger", response_model=list[LedgerEventRead], summary="View append-only ledger")
async def get_ledger(limit: int = 200, db: Session = Depends(get_db)):
    service = PersonalIntelligenceService(db)
    return service.ledger(limit=limit)


@router.get("/summary", response_model=SummaryRead, summary="Generate timeline summary")
async def get_summary(limit: int = 100, db: Session = Depends(get_db)):
    service = PersonalIntelligenceService(db)
    return service.summary(limit=limit)
