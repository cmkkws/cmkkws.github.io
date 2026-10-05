import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import torch
from llm_lab.ops.tensor_ops import split_heads, merge_heads, batched_matmul

def test_p02_tensor_ops():
    print("--- Running P02 Tensor & Head Manipulation Test ---")
    
    B, T, D, H = 2, 16, 64, 4
    x = torch.randn(B, T, D)
    
    # 1. Split heads test
    x_split = split_heads(x, num_heads=H)
    assert x_split.shape == (B, H, T, D // H), f"Unexpected split shape: {x_split.shape}"
    print(f"[PASS] split_heads Shape Test Passed: {x.shape} -> {x_split.shape}")
    
    # 2. Contiguous check: transpose로 인해 x_split 메모리는 비연속적(Non-contiguous) 상태여야 함
    assert not x_split.is_contiguous(), "x_split tensor should be non-contiguous after transpose!"
    print("[PASS] Transpose Non-Contiguous Memory State Verified.")
    
    # 3. Merge heads and reconstruction test
    x_reconstructed = merge_heads(x_split)
    assert x_reconstructed.shape == x.shape, f"Unexpected merged shape: {x_reconstructed.shape}"
    assert torch.allclose(x, x_reconstructed), "Reconstructed tensor values do not match original tensor!"
    assert x_reconstructed.is_contiguous(), "Merged tensor must be contiguous!"
    print("[PASS] merge_heads & Value Reconstruction Test Passed.")
    
    # 4. Batched matmul test
    d = D // H
    q = torch.randn(B, H, T, d)
    k = torch.randn(B, H, T, d)
    scores = batched_matmul(q, k)
    assert scores.shape == (B, H, T, T), f"Unexpected batched matmul shape: {scores.shape}"
    print(f"[PASS] batched_matmul Shape Test Passed: {q.shape} @ {k.shape}^T -> {scores.shape}")
    print("--- P02 All Tests Passed Successfully! ---")

if __name__ == "__main__":
    test_p02_tensor_ops()
