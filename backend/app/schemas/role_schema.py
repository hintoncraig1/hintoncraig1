from typing import List, Literal

from pydantic import BaseModel, Field


ProgressionStage = Literal["introduced", "practiced", "retained", "applied", "verified"]
RoleStatus = Literal["active", "draft", "retired"]


class ExpertRoleCreate(BaseModel):
    id: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    coreResponsibilities: List[str]
    automationTools: List[str]
    learningGoals: List[str]
    progressionStage: ProgressionStage
    reviewCadenceDays: List[int]
    status: RoleStatus


class ExpertRoleRead(ExpertRoleCreate):
    pass
