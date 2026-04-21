from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Text, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class ExpertRoleTable(Base):
    __tablename__ = "expert_roles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    core_responsibilities: Mapped[list] = mapped_column("core_responsibilities", JSON, nullable=False)
    automation_tools: Mapped[list] = mapped_column("automation_tools", JSON, nullable=False)
    learning_goals: Mapped[list] = mapped_column("learning_goals", JSON, nullable=False)
    progression_stage: Mapped[str] = mapped_column("progression_stage", String(32), nullable=False)
    review_cadence_days: Mapped[list] = mapped_column("review_cadence_days", JSON, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)


class VaultEntryTable(Base):
    __tablename__ = "vault_entries"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    entry_type: Mapped[str] = mapped_column(String(16), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source_uri: Mapped[str | None] = mapped_column(String(512), nullable=True)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)


class LedgerEventTable(Base):
    __tablename__ = "ledger_events"
    __table_args__ = (
        UniqueConstraint("previous_hash", name="uq_ledger_events_previous_hash"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    entry_id: Mapped[str] = mapped_column(String(64), ForeignKey("vault_entries.id"), nullable=False)
    event_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    previous_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, index=True)
