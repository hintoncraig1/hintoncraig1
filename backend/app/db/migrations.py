from __future__ import annotations

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


UNIQUE_NAME = "uq_ledger_events_previous_hash"
TABLE_NAME = "ledger_events"
COLUMN_NAME = "previous_hash"


def _has_previous_hash_uniqueness(engine: Engine) -> bool:
    inspector = inspect(engine)

    for constraint in inspector.get_unique_constraints(TABLE_NAME):
        columns = set(constraint.get("column_names") or [])
        if columns == {COLUMN_NAME}:
            return True

    for index in inspector.get_indexes(TABLE_NAME):
        if not index.get("unique"):
            continue
        columns = set(index.get("column_names") or [])
        if columns == {COLUMN_NAME}:
            return True

    return False


def ensure_ledger_previous_hash_uniqueness(engine: Engine) -> None:
    """Apply a one-time schema fix for existing deployments.

    Base.metadata.create_all(...) creates missing tables, but will not add newly
    declared constraints to tables that already exist. This function backfills
    the ledger head uniqueness requirement for upgraded databases.
    """

    inspector = inspect(engine)
    if TABLE_NAME not in inspector.get_table_names():
        return

    if _has_previous_hash_uniqueness(engine):
        return

    dialect = engine.dialect.name
    if dialect == "postgresql":
        statement = (
            f"ALTER TABLE {TABLE_NAME} "
            f"ADD CONSTRAINT {UNIQUE_NAME} UNIQUE ({COLUMN_NAME})"
        )
    else:
        statement = (
            f"CREATE UNIQUE INDEX {UNIQUE_NAME} "
            f"ON {TABLE_NAME} ({COLUMN_NAME})"
        )

    with engine.begin() as connection:
        connection.execute(text(statement))
