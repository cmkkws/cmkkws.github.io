import sys
import torch

def verify_environment():
    print("=" * 60)
    print("  [PyTorch & CUDA Environment Diagnostic Tool]")
    print("=" * 60)
    print(f"Python Executable : {sys.executable}")
    print(f"PyTorch Version   : {torch.__version__}")
    print(f"CUDA Available    : {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        print(f"PyTorch CUDA Ver  : {torch.version.cuda}")
        print(f"Device Count      : {torch.cuda.device_count()}")
        print(f"Device Name       : {torch.cuda.get_device_name(0)}")
        
        # GPU 텐서 연산 및 Autograd Smoke Run
        x = torch.randn(1024, 1024, device="cuda", requires_grad=True)
        y = torch.matmul(x, x)
        loss = y.sum()
        loss.backward()
        print("[SUCCESS] GPU Tensor Matmul & Backward Backward Pass Executed!")
        print(f"Allocated VRAM    : {torch.cuda.memory_allocated(0) / 1024**2:.2f} MB")
    else:
        print("[INFO] CUDA/GPU unavailable. Running CPU tensor matmul smoke test...")
        x = torch.randn(512, 512, device="cpu", requires_grad=True)
        y = torch.matmul(x, x)
        loss = y.sum()
        loss.backward()
        print("[SUCCESS] CPU Tensor Matmul & Backward Pass Executed Successfully!")
    print("=" * 60)

if __name__ == "__main__":
    verify_environment()
