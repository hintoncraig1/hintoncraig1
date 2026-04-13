import json
import logging
from pathlib import Path
from typing import Any, Dict, List

from neo4j import AsyncDriver
from sqlalchemy.orm import Session

from app.models.sql_models import ExpertRoleTable
from app.schemas.role_schema import ExpertRoleCreate, ExpertRoleRead

logger = logging.getLogger("fornix.role_ingestion")


class RoleIngestionService:
    """Ingest canonical expert roles into PostgreSQL and Neo4j."""

    def __init__(self, db: Session, neo4j_driver: AsyncDriver):
        self.db = db
        self.neo4j = neo4j_driver

    async def ingest_roles_from_json(self, filepath: str) -> Dict[str, Any]:
        payload = self._load_roles(filepath)
        logger.info("Starting role ingestion for %s records", len(payload))

        ingested = 0
        for raw in payload:
            role = ExpertRoleCreate(**raw)
            await self.upsert_role(role)
            ingested += 1

        return {"status": "success", "ingested": ingested}

    async def upsert_role(self, role: ExpertRoleCreate) -> ExpertRoleRead:
        self._upsert_postgres(role)
        await self._upsert_neo4j(role)
        return ExpertRoleRead(**role.model_dump())

    def list_roles(self) -> List[ExpertRoleRead]:
        rows = self.db.query(ExpertRoleTable).order_by(ExpertRoleTable.id.asc()).all()
        return [self._to_read_model(row) for row in rows]

    def get_role(self, role_id: str) -> ExpertRoleRead | None:
        row = self.db.get(ExpertRoleTable, role_id)
        return self._to_read_model(row) if row else None

    def _load_roles(self, filepath: str) -> List[Dict[str, Any]]:
        with Path(filepath).open("r", encoding="utf-8") as handle:
            return json.load(handle)

    def _upsert_postgres(self, role: ExpertRoleCreate) -> None:
        existing_role = self.db.get(ExpertRoleTable, role.id)

        if existing_role:
            existing_role.role = role.role
            existing_role.core_responsibilities = role.coreResponsibilities
            existing_role.automation_tools = role.automationTools
            existing_role.learning_goals = role.learningGoals
            existing_role.progression_stage = role.progressionStage
            existing_role.review_cadence_days = role.reviewCadenceDays
            existing_role.status = role.status
        else:
            existing_role = ExpertRoleTable(
                id=role.id,
                role=role.role,
                core_responsibilities=role.coreResponsibilities,
                automation_tools=role.automationTools,
                learning_goals=role.learningGoals,
                progression_stage=role.progressionStage,
                review_cadence_days=role.reviewCadenceDays,
                status=role.status,
            )
            self.db.add(existing_role)

        self.db.commit()

    async def _upsert_neo4j(self, role: ExpertRoleCreate) -> None:
        cypher_query = """
        MERGE (r:ExpertRole {id: $id})
        SET r.name = $role,
            r.status = $status,
            r.progressionStage = $progressionStage,
            r.reviewCadenceDays = $reviewCadenceDays
        WITH r
        UNWIND $learningGoals AS goal
        MERGE (g:LearningGoal {name: goal})
        MERGE (r)-[:REQUIRES_MASTERY_OF]->(g)
        WITH r
        UNWIND $responsibilities AS resp
        MERGE (t:Responsibility {name: resp})
        MERGE (r)-[:OWNS_TASK]->(t)
        WITH r
        UNWIND $automationTools AS tool
        MERGE (a:AutomationTool {name: tool})
        MERGE (r)-[:USES_TOOL]->(a)
        """

        async with self.neo4j.session() as session:
            await session.run(
                cypher_query,
                id=role.id,
                role=role.role,
                status=role.status,
                progressionStage=role.progressionStage,
                reviewCadenceDays=role.reviewCadenceDays,
                learningGoals=role.learningGoals,
                responsibilities=role.coreResponsibilities,
                automationTools=role.automationTools,
            )

    def _to_read_model(self, row: ExpertRoleTable) -> ExpertRoleRead:
        return ExpertRoleRead(
            id=row.id,
            role=row.role,
            coreResponsibilities=row.core_responsibilities,
            automationTools=row.automation_tools,
            learningGoals=row.learning_goals,
            progressionStage=row.progression_stage,
            reviewCadenceDays=row.review_cadence_days,
            status=row.status,
        )
