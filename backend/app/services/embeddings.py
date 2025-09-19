from __future__ import annotations

from typing import List

# 4-dim embedding to match schema

def embed_text_to_vector(text: str) -> List[float]:
    # Simple deterministic hash-based embedding for demo
    h = [0, 0, 0, 0]
    for i, ch in enumerate(text.encode("utf-8")):
        h[i % 4] = (h[i % 4] + ch) % 100
    # normalize to [-1,1]
    return [(x / 50.0) - 1.0 for x in h]
