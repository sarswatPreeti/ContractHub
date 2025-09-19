from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class DocumentOut(BaseModel):
    doc_id: uuid.UUID
    filename: str
    uploaded_on: str
    expiry_date: Optional[str]
    status: str
    risk_score: str
    parties: Optional[str] = None
    contract_type: Optional[str] = None

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    doc_id: uuid.UUID
    chunks_inserted: int

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

class ChunkOut(BaseModel):
    chunk_id: uuid.UUID
    text_chunk: str
    relevance: float
    metadata: dict

class QueryResponse(BaseModel):
    answer: str
    chunks: List[ChunkOut]

class ContractClause(BaseModel):
    title: str
    text: str
    confidence: float
    page: Optional[int] = None

class ContractInsight(BaseModel):
    type: str  # "risk" or "recommendation"
    title: str
    description: str
    severity: str  # "low", "medium", "high"

class ContractDetailOut(BaseModel):
    doc_id: uuid.UUID
    filename: str
    uploaded_on: str
    expiry_date: Optional[str]
    status: str
    risk_score: str
    parties: Optional[str] = None
    contract_type: Optional[str] = None
    clauses: List[ContractClause]
    insights: List[ContractInsight]

    class Config:
        from_attributes = True
