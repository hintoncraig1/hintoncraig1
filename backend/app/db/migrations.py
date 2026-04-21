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


def _has_duplicate_previous_hashes(engine: Engine) -> bool:
    query = text(
        """
        SELECT 1
        FROM ledger_events
        WHERE previous_hash IS NOT NULL
        GROUP BY previous_hash
        HAVING COUNT(*) > 1
        LIMIT 1
        """
    )

    with engine.begin() as connection:
        return connection.execute(query).first() is not None


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

    if _has_duplicate_previous_hashes(engine):
        raise RuntimeError(
            "Cannot apply previous_hash uniqueness: existing duplicate ledger head links found. "
            "Please deduplicate ledger_events.previous_hash values before startup."
        )

    statement = (
        f"CREATE UNIQUE INDEX IF NOT EXISTS {UNIQUE_NAME} "
        f"ON {TABLE_NAME} ({COLUMN_NAME})"
    )
    with engine.begin() as connection:
        connection.execute(text(statement))
