import torch

def split_heads(x: torch.Tensor, num_heads: int) -> torch.Tensor:
    """
    [B, T, D] 차원의 텐서를 Multi-Head Attention 연산을 위해 [B, H, T, d] 차원으로 분할합니다.
    (D = H * d)
    """
    B, T, D = x.shape
    assert D % num_heads == 0, f"Hidden dimension D({D}) must be divisible by num_heads({num_heads})"
    d = D // num_heads
    
    # [B, T, D] -> [B, T, H, d] -> [B, H, T, d]
    x_reshaped = x.view(B, T, num_heads, d)
    x_split = x_reshaped.transpose(1, 2)  # [B, H, T, d]
    return x_split

def merge_heads(x: torch.Tensor) -> torch.Tensor:
    """
    [B, H, T, d] 차원의 텐서를 다시 [B, T, D] 차원으로 병합합니다.
    (D = H * d)
    transpose 이후 메모리가 비연속적(Non-contiguous)이 되므로 .contiguous() 호출이 필요합니다.
    """
    B, H, T, d = x.shape
    # [B, H, T, d] -> [B, T, H, d]
    x_transposed = x.transpose(1, 2)
    # contiguous 검사 및 메모리 재배치
    if not x_transposed.is_contiguous():
        x_transposed = x_transposed.contiguous()
    
    # [B, T, H, d] -> [B, T, H * d]
    x_merged = x_transposed.view(B, T, H * d)
    return x_merged

def batched_matmul(q: torch.Tensor, k: torch.Tensor) -> torch.Tensor:
    """
    Q: [B, H, T_q, d] 와 K: [B, H, T_k, d] 간의 배치 행렬곱을 수행하여 Attention Score [B, H, T_q, T_k]를 산출합니다.
    """
    # K.transpose(-2, -1) -> [B, H, d, T_k]
    # [B, H, T_q, d] @ [B, H, d, T_k] -> [B, H, T_q, T_k]
    scores = torch.matmul(q, k.transpose(-2, -1))
    return scores
