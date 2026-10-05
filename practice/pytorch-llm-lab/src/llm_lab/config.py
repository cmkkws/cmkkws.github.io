import json
from dataclasses import dataclass, asdict
from typing import Optional, Any, Dict
from pathlib import Path

@dataclass
class ModelConfig:
    vocab_size: int = 32000
    hidden_dim: int = 512
    num_heads: int = 8
    num_layers: int = 6
    max_seq_len: int = 1024
    intermediate_dim: Optional[int] = None
    rms_norm_eps: float = 1e-6
    rope_theta: float = 10000.0

    def __post_init__(self):
        if self.intermediate_dim is None:
            self.intermediate_dim = 4 * self.hidden_dim

    @classmethod
    def from_json(cls, json_path: str) -> "ModelConfig":
        path = Path(json_path)
        if not path.exists():
            raise FileNotFoundError(f"Config file not found at: {json_path}")
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)

    def to_json(self, json_path: str) -> None:
        path = Path(json_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(asdict(self), f, indent=2, ensure_ascii=False)
