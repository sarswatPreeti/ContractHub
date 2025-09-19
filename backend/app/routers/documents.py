from __future__ import annotations

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from .. import models
from ..schemas import DocumentOut, UploadResponse, ContractDetailOut, ContractClause, ContractInsight
from ..services.llama_mock import mock_parse_and_chunk, generate_mock_contract_metadata
from ..services.embeddings import embed_text_to_vector
from ..dependencies import get_current_user_id

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    content_bytes = await file.read()
    try:
        text = content_bytes.decode("utf-8", errors="ignore")
    except Exception:
        text = ""

    # Generate mock contract metadata
    mock_metadata = generate_mock_contract_metadata(file.filename or "contract.pdf")
    
    document = models.Document(
        user_id=user_id, 
        filename=file.filename or "contract.pdf",
        parties=mock_metadata["parties"],
        contract_type=mock_metadata["contract_type"],
        expiry_date=mock_metadata["expiry_date"],
        status=mock_metadata["status"],
        risk_score=mock_metadata["risk_score"]
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    parsed = mock_parse_and_chunk(file.filename or "contract.pdf", text)
    chunks_to_add: list[models.Chunk] = []
    for ch in parsed["chunks"]:
        vec = ch.get("embedding") or embed_text_to_vector(ch.get("text", ""))
        chunk = models.Chunk(
            doc_id=document.doc_id,
            user_id=user_id,
            text_chunk=ch["text"],
            embedding=vec,
            chunk_metadata=ch.get("metadata", {}),
        )
        chunks_to_add.append(chunk)
    db.add_all(chunks_to_add)
    db.commit()

    return UploadResponse(doc_id=document.doc_id, chunks_inserted=len(chunks_to_add))


@router.get("/list", response_model=List[DocumentOut])
def list_documents(
    user_id: uuid.UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    docs = db.query(models.Document).filter(models.Document.user_id == user_id).order_by(models.Document.uploaded_on.desc()).all()
    
    # Convert datetime objects to strings for serialization
    result = []
    for doc in docs:
        doc_dict = {
            "doc_id": doc.doc_id,
            "filename": doc.filename,
            "uploaded_on": doc.uploaded_on.isoformat(),
            "expiry_date": doc.expiry_date.isoformat() if doc.expiry_date else None,
            "status": doc.status,
            "risk_score": doc.risk_score,
            "parties": doc.parties,
            "contract_type": doc.contract_type,
        }
        result.append(DocumentOut(**doc_dict))
    
    return result


@router.get("/{doc_id}", response_model=ContractDetailOut)
def get_contract_detail(
    doc_id: uuid.UUID, 
    user_id: uuid.UUID = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    # Get document with user verification
    doc = db.query(models.Document).filter(
        models.Document.doc_id == doc_id,
        models.Document.user_id == user_id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
    
    # Get chunks for this document to generate clauses
    chunks = db.query(models.Chunk).filter(
        models.Chunk.doc_id == doc_id,
        models.Chunk.user_id == user_id
    ).all()
    
    # Generate clauses from chunks
    clauses = []
    for chunk in chunks[:6]:  # Limit to first 6 for demo
        clause_type = chunk.chunk_metadata.get("clause_type", "general")
        page = chunk.chunk_metadata.get("page", 1)
        confidence = chunk.chunk_metadata.get("confidence", 0.85)
        
        clauses.append(ContractClause(
            title=f"{clause_type.replace('_', ' ').title()} Clause",
            text=chunk.text_chunk,
            confidence=confidence,
            page=page
        ))
    
    # Generate mock insights based on risk score and status
    insights = []
    
    if doc.risk_score == "High":
        insights.extend([
            ContractInsight(
                type="risk",
                title="Contract Expiration Risk",
                description="This contract is approaching expiration and requires immediate attention.",
                severity="high"
            ),
            ContractInsight(
                type="recommendation", 
                title="Renewal Required",
                description="Initiate renewal discussions at least 60 days before expiration.",
                severity="medium"
            )
        ])
    elif doc.risk_score == "Medium":
        insights.extend([
            ContractInsight(
                type="risk",
                title="Terms Review Needed",
                description="Some contract terms may need clarification or updates.",
                severity="medium"
            ),
            ContractInsight(
                type="recommendation",
                title="Schedule Review Meeting", 
                description="Plan a contract review meeting with stakeholders.",
                severity="low"
            )
        ])
    else:
        insights.append(ContractInsight(
            type="recommendation",
            title="Contract in Good Standing",
            description="Contract terms are clear and well-defined. Continue monitoring for compliance.",
            severity="low"
        ))
    
    # Add general recommendations
    if doc.status == "Renewal Due":
        insights.append(ContractInsight(
            type="recommendation",
            title="Prepare Renewal Documentation",
            description="Gather necessary documents and approvals for contract renewal.",
            severity="medium"
        ))
    
    return ContractDetailOut(
        doc_id=doc.doc_id,
        filename=doc.filename,
        uploaded_on=doc.uploaded_on.isoformat(),
        expiry_date=doc.expiry_date.isoformat() if doc.expiry_date else None,
        status=doc.status,
        risk_score=doc.risk_score,
        parties=doc.parties,
        contract_type=doc.contract_type,
        clauses=clauses,
        insights=insights
    )
