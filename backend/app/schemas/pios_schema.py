from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


EntryType = Literal["text", "voice", "file"]


class EntryCreate(BaseModel):
    entryType: EntryType
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    sourceUri: str | None = None


class EntryRead(BaseModel):
    id: str
    entryType: EntryType
    title: str
    content: str
    sourceUri: str | None = None
    contentHash: str
    createdAt: datetime


class LedgerEventRead(BaseModel):
    id: str
    eventType: str
    entryId: str
    eventHash: str
    previousHash: str | None
    createdAt: datetime


class SummaryRead(BaseModel):
    timelineCount: int
    latestEntryId: str | None
    summary: str
