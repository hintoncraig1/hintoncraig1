from fastapi import APIRouter, Depends, HTTPException, Security
from neo4j import AsyncDriver
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_neo4j, verify_iam_seal
from app.schemas.role_schema import ExpertRoleCreate, ExpertRoleRead
from app.services.role_ingestion_service import RoleIngestionService

router = APIRouter(prefix="/api/v1/governance", tags=["Governance"])


@router.post("/ingest-roles", summary="Ingest Canonical Expert Roles")
async def trigger_role_ingestion(
    db: Session = Depends(get_db),
    neo4j: AsyncDriver = Depends(get_neo4j),
    iam_seal: str = Security(verify_iam_seal),
):
    service = RoleIngestionService(db, neo4j)
    result = await service.ingest_roles_from_json("docs/data/canonical_expert_roles.json")
    return {"iam": iam_seal, **result}


@router.get("/roles", response_model=list[ExpertRoleRead], summary="List Expert Roles")
async def list_expert_roles(
    db: Session = Depends(get_db),
    neo4j: AsyncDriver = Depends(get_neo4j),
):
    service = RoleIngestionService(db, neo4j)
    return service.list_roles()


@router.get("/roles/{role_id}", response_model=ExpertRoleRead, summary="Get Expert Role")
async def get_expert_role(
    role_id: str,
    db: Session = Depends(get_db),
    neo4j: AsyncDriver = Depends(get_neo4j),
):
    service = RoleIngestionService(db, neo4j)
    role = service.get_role(role_id)
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


@router.post("/roles", response_model=ExpertRoleRead, summary="Create or Update Expert Role")
async def create_or_update_expert_role(
    payload: ExpertRoleCreate,
    db: Session = Depends(get_db),
    neo4j: AsyncDriver = Depends(get_neo4j),
    iam_seal: str = Security(verify_iam_seal),
):
    service = RoleIngestionService(db, neo4j)
    role = await service.upsert_role(payload)
    return role
