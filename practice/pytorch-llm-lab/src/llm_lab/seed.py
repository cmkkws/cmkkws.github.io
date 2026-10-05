import random
import os
import numpy as np
import torch

def set_seed(seed: int = 42) -> None:
    """
    재현성을 보장하기 위해 Python, NumPy, PyTorch(CPU/GPU) 및 CUDA 결정론적 시드를 설정합니다.
    """
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
        # cuDNN 결정론적 연산 옵션
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
    print(f"[LLM Lab] Global Random Seed set to: {seed}")
