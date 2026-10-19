import numpy as np
from PIL import Image
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "textures"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(26)

# ---------------------------------------------------------------- grain
# 2048² RGBA monochrome grain. Used at ~6% opacity so it reads on both
# near-black and paper, and never repeats inside a 1920×1080 frame.
size = 1024
yy, xx = np.mgrid[0:size, 0:size]
fine = rng.normal(0, 1, (size, size))
# a touch of low-frequency clumping so it looks like film, not TV static
low = rng.normal(0, 1, (size // 64 + 1, size // 64 + 1))
low = np.kron(low, np.ones((64, 64)))[:size, :size]
clump = 0.10 * low + 0.99 * fine
clump = (clump - clump.mean()) / (clump.std() + 1e-9)

grain = np.clip(128 + clump * 46, 0, 255).astype(np.uint8)
alpha = np.clip(np.abs(clump) * 26, 0, 30).astype(np.uint8)
rgba = np.dstack([grain, grain, grain, alpha])
Image.fromarray(rgba, "RGBA").save(OUT / "grain.png", optimize=True)

# ---------------------------------------------------------------- paper
# Warm paper with low-frequency mottling + fibre. 2048², tiled once.
base = np.array([242, 236, 223], dtype=np.float64)
m = rng.normal(0, 1, (size // 8 + 1, size // 8 + 1))
m = np.kron(m, np.ones((8, 8)))[:size, :size]
m2 = rng.normal(0, 1, (size // 128 + 1, size // 128 + 1))
m2 = np.kron(m2, np.ones((128, 128)))[:size, :size]
field = 0.55 * m + 0.9 * m2
field = (field - field.mean()) / (field.std() + 1e-9)
fibre = rng.normal(0, 1, (size, size))
fibre = (fibre - fibre.mean()) / (fibre.std() + 1e-9)

lum = 1 + field * 0.012 + fibre * 0.006
warm = 1 + field * 0.004
paper = np.zeros((size, size, 3), dtype=np.float64)
paper[..., 0] = base[0] * lum
paper[..., 1] = base[1] * lum * (2 - warm)
paper[..., 2] = base[2] * lum * (2 - warm)
paper = np.clip(paper, 0, 255).astype(np.uint8)
Image.fromarray(paper, "RGB").save(OUT / "paper.jpg", quality=92, subsampling=1)

print("grain", (OUT / "grain.png").stat().st_size)
print("paper", (OUT / "paper.jpg").stat().st_size)
