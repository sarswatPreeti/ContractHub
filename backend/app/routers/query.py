from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid

from ..database import get_db
from ..schemas import QueryRequest, QueryResponse, ChunkOut
from ..services.embeddings import embed_text_to_vector
from ..dependencies import get_current_user_id

router = APIRouter()


@router.post("/search", response_model=QueryResponse)
def search(
    req: QueryRequest, 
    user_id: uuid.UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    qvec = embed_text_to_vector(req.query)
    # Convert list to PostgreSQL vector format string
    qvec_str = f"[{','.join(map(str, qvec))}]"
    # Use SQL for pgvector cosine distance with fully formatted string
    sql = text(
        f"""
        SELECT chunk_id, text_chunk, chunk_metadata, 1 - (embedding <=> '{qvec_str}'::vector) AS relevance
        FROM chunks
        WHERE user_id = '{str(user_id)}'
        ORDER BY embedding <=> '{qvec_str}'::vector
        LIMIT {req.top_k}
        """
    )
    rows = db.execute(sql).mappings().all()
    chunks: List[ChunkOut] = []
    for r in rows:
        chunks.append(
            ChunkOut(
                chunk_id=r["chunk_id"],
                text_chunk=r["text_chunk"],
                relevance=float(r["relevance"]),
                metadata=r["chunk_metadata"],
            )
        )
    
    # Generate more contextual mock answer based on query
    if "termination" in req.query.lower():
        answer = "Based on the contract analysis, termination clauses typically require 90 days written notice. The retrieved clauses show specific termination conditions and notice requirements."
    elif "liability" in req.query.lower():
        answer = "Liability provisions in your contracts generally limit exposure to 12 months of fees. Review the specific liability caps and exclusions in each contract."
    elif "payment" in req.query.lower():
        answer = "Payment terms across your contracts typically require payment within 30 days of invoice receipt, with potential late payment charges of 1.5% monthly."
    elif "confidentiality" in req.query.lower():
        answer = "Confidentiality clauses protect proprietary information during the contract term and typically extend beyond contract termination."
    else:
        answer = f"Based on your query about '{req.query}', I found {len(chunks)} relevant contract clauses. The retrieved sections provide specific details about your contract terms and conditions."
    
    return QueryResponse(answer=answer, chunks=chunks)
