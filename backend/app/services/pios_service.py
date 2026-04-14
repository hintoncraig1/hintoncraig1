import hashlib
import re
from collections import Counter
from datetime import datetime
from uuid import uuid4

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.sql_models import LedgerEventTable, VaultEntryTable
from app.schemas.pios_schema import EntryCreate, EntryRead, LedgerEventRead, SummaryRead

STOP_WORDS = {
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "have",
    "your",
    "into",
    "over",
    "are",
    "was",
    "were",
    "been",
}


class PersonalIntelligenceService:
    """Capture -> hash -> store -> link -> view -> summarize loop."""

    def __init__(self, db: Session):
        self.db = db

    def create_entry(self, payload: EntryCreate) -> tuple[EntryRead, LedgerEventRead]:
        content_hash = self._sha256(payload.content)
        entry_id = f"entry-{uuid4().hex}"
        now = datetime.utcnow()

        entry = VaultEntryTable(
            id=entry_id,
            entry_type=payload.entryType,
            title=payload.title,
            content=payload.content,
            source_uri=payload.sourceUri,
            content_hash=content_hash,
            created_at=now,
        )
        self.db.add(entry)

        self._acquire_ledger_head_lock()
        previous_event = (
            self.db.query(LedgerEventTable)
            .with_for_update()
            .order_by(LedgerEventTable.created_at.desc())
            .first()
        )
        previous_hash = previous_event.event_hash if previous_event else None

        receipt_seed = "|".join([entry.id, content_hash, previous_hash or "genesis", now.isoformat()])
        event = LedgerEventTable(
            id=f"evt-{uuid4().hex}",
            event_type="entry.captured",
            entry_id=entry.id,
            event_hash=self._sha256(receipt_seed),
            previous_hash=previous_hash,
            created_at=now,
        )
        self.db.add(event)
        self.db.commit()

        return self._to_entry_read(entry), self._to_event_read(event)

    def _acquire_ledger_head_lock(self) -> None:
        """Serialize append operations so each event links to a unique predecessor."""
        if self.db.bind and self.db.bind.dialect.name == "postgresql":
            # Transaction-scoped advisory lock protects the chain head even when ledger_events is empty.
            self.db.execute(text("SELECT pg_advisory_xact_lock(:lock_id)"), {"lock_id": 1903217431})

    def timeline(self, limit: int = 100) -> list[EntryRead]:
        rows = (
            self.db.query(VaultEntryTable)
            .order_by(VaultEntryTable.created_at.desc())
            .limit(limit)
            .all()
        )
        return [self._to_entry_read(row) for row in rows]

    def ledger(self, limit: int = 200) -> list[LedgerEventRead]:
        rows = (
            self.db.query(LedgerEventTable)
            .order_by(LedgerEventTable.created_at.desc())
            .limit(limit)
            .all()
        )
        return [self._to_event_read(row) for row in rows]

    def summary(self, limit: int = 100) -> SummaryRead:
        entries = self.timeline(limit=limit)
        if not entries:
            return SummaryRead(timelineCount=0, latestEntryId=None, summary="No entries captured yet.")

        tokens: list[str] = []
        for entry in entries:
            tokens.extend(self._tokenize(entry.title))
            tokens.extend(self._tokenize(entry.content))

        keyword_counts = Counter(tokens)
        top_keywords = [term for term, _ in keyword_counts.most_common(5)]
        keyword_sentence = ", ".join(top_keywords) if top_keywords else "general activity"

        return SummaryRead(
            timelineCount=len(entries),
            latestEntryId=entries[0].id,
            summary=f"Captured {len(entries)} entries. Dominant themes: {keyword_sentence}.",
        )

    @staticmethod
    def _sha256(value: str) -> str:
        return hashlib.sha256(value.encode("utf-8")).hexdigest()

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        raw_tokens = re.findall(r"[a-zA-Z0-9]{3,}", text.lower())
        return [token for token in raw_tokens if token not in STOP_WORDS]

    @staticmethod
    def _to_entry_read(row: VaultEntryTable) -> EntryRead:
        return EntryRead(
            id=row.id,
            entryType=row.entry_type,
            title=row.title,
            content=row.content,
            sourceUri=row.source_uri,
            contentHash=row.content_hash,
            createdAt=row.created_at,
        )

    @staticmethod
    def _to_event_read(row: LedgerEventTable) -> LedgerEventRead:
        return LedgerEventRead(
            id=row.id,
            eventType=row.event_type,
            entryId=row.entry_id,
            eventHash=row.event_hash,
            previousHash=row.previous_hash,
            createdAt=row.created_at,
        )
