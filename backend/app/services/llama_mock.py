from __future__ import annotations

import random
from typing import List, Dict
from .embeddings import embed_text_to_vector

# Enhanced mock contract clauses for better demo
MOCK_CONTRACT_CLAUSES = [
    "This Master Service Agreement ('Agreement') is entered into between Party A and Party B effective as of [Date].",
    "TERM: This Agreement shall commence on [Start Date] and continue for a period of [Duration] unless terminated earlier.",
    "TERMINATION: Either party may terminate this Agreement with 90 days' written notice to the other party.",
    "LIABILITY: In no event shall either party's liability exceed the total fees paid under this Agreement in the 12 months preceding the incident.",
    "CONFIDENTIALITY: Both parties agree to maintain confidentiality of all proprietary information disclosed during the term of this Agreement.",
    "PAYMENT TERMS: Invoices shall be paid within 30 days of receipt. Late payments may incur a 1.5% monthly service charge.",
    "INTELLECTUAL PROPERTY: All intellectual property developed under this Agreement shall remain the property of the developing party.",
    "FORCE MAJEURE: Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.",
    "GOVERNING LAW: This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].",
    "DISPUTE RESOLUTION: Any disputes arising under this Agreement shall be resolved through binding arbitration.",
    "INDEMNIFICATION: Each party shall indemnify the other against claims arising from their negligent acts or omissions.",
    "MODIFICATION: This Agreement may only be modified by written consent of both parties.",
]

MOCK_PARTIES = [
    "Acme Corporation, TechCorp Solutions",
    "Global Industries Inc., Local Services LLC", 
    "Enterprise Systems Ltd., Innovation Partners",
    "Strategic Consulting Group, Development Co.",
    "Advanced Technologies, Business Solutions Inc."
]

MOCK_CONTRACT_TYPES = [
    "Master Service Agreement",
    "Software License Agreement", 
    "Non-Disclosure Agreement",
    "Employment Contract",
    "Vendor Agreement",
    "Partnership Agreement"
]

def mock_parse_and_chunk(filename: str, content_text: str | None = None) -> Dict:
    """Enhanced mock parsing that generates realistic contract chunks with metadata"""
    if content_text and len(content_text.split()) > 20:
        # For uploaded content, try to extract meaningful chunks
        lines = [l.strip() for l in content_text.replace("\r", "").split("\n") if l.strip()]
        if not lines:
            lines = [content_text]
        
        chunks = []
        for idx, line in enumerate(lines[:10]):  # Limit to first 10 meaningful lines
            if len(line) > 20:  # Only include substantial content
                chunks.append({
                    "chunk_id": f"chunk_{idx}",
                    "text": line,
                    "embedding": embed_text_to_vector(line),
                    "metadata": {
                        "page": (idx // 3) + 1,  # Simulate ~3 chunks per page
                        "contract_name": filename,
                        "clause_type": "general",
                        "confidence": round(random.uniform(0.7, 0.95), 2)
                    },
                })
        
        if chunks:
            return {"document_id": f"doc_{hash(filename) % 10000}", "chunks": chunks}
    
    # Fallback to enhanced mock data
    chunks = []
    num_chunks = random.randint(6, 12)
    selected_clauses = random.sample(MOCK_CONTRACT_CLAUSES, min(num_chunks, len(MOCK_CONTRACT_CLAUSES)))
    
    clause_types = ["termination", "liability", "payment", "confidentiality", "intellectual_property", "general"]
    
    for idx, clause_text in enumerate(selected_clauses):
        chunks.append({
            "chunk_id": f"mock_chunk_{idx}",
            "text": clause_text,
            "embedding": embed_text_to_vector(clause_text),
            "metadata": {
                "page": random.randint(1, 5),
                "contract_name": filename,
                "clause_type": random.choice(clause_types),
                "confidence": round(random.uniform(0.75, 0.98), 2)
            },
        })
    
    return {"document_id": f"mock_doc_{hash(filename) % 10000}", "chunks": chunks}

def generate_mock_contract_metadata(filename: str) -> Dict:
    """Generate mock contract metadata for demo purposes"""
    import datetime
    
    # Generate realistic expiry date (6 months to 3 years from now)
    start_date = datetime.datetime.now()
    days_to_add = random.randint(180, 1095)  # 6 months to 3 years
    expiry_date = start_date + datetime.timedelta(days=days_to_add)
    
    # Determine status based on expiry
    days_until_expiry = (expiry_date - start_date).days
    if days_until_expiry < 30:
        status = "Renewal Due"
    elif days_until_expiry < 0:
        status = "Expired"
    else:
        status = random.choice(["Active", "Active", "Active", "Renewal Due"])  # Weighted towards Active
    
    # Risk score logic
    if status == "Expired":
        risk_score = "High"
    elif status == "Renewal Due":
        risk_score = random.choice(["Medium", "High"])
    else:
        risk_score = random.choice(["Low", "Low", "Medium", "High"])  # Weighted towards Low
    
    return {
        "parties": random.choice(MOCK_PARTIES),
        "contract_type": random.choice(MOCK_CONTRACT_TYPES),
        "expiry_date": expiry_date,
        "status": status,
        "risk_score": risk_score
    }
