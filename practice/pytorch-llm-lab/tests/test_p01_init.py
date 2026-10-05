import sys
from pathlib import Path

# Add src to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import torch
from llm_lab.seed import set_seed
from llm_lab.config import ModelConfig

def test_p01_seed_and_config():
    print("--- Running P01 Initialization Test ---")
    
    # 1. Seed reproducibility test
    set_seed(42)
    a = torch.randn(3, 3)
    
    set_seed(42)
    b = torch.randn(3, 3)
    
    assert torch.allclose(a, b), "Seed test failed! Tensors do not match."
    print("[PASS] Seed Reproducibility Test Passed.")
    
    # 2. Config parser test
    config_path = Path(__file__).resolve().parent.parent / "configs" / "unit.json"
    cfg = ModelConfig.from_json(str(config_path))
    assert cfg.vocab_size == 1000
    assert cfg.hidden_dim == 64
    assert cfg.num_heads == 4
    print(f"[PASS] ModelConfig JSON Parser Passed: {cfg}")
    print("--- P01 All Tests Passed Successfully! ---")

if __name__ == "__main__":
    test_p01_seed_and_config()
