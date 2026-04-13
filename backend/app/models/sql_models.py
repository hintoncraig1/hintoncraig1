from sqlalchemy import JSON, String
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
