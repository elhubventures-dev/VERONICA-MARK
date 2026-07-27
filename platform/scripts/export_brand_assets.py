"""Build web brand assets from official logo SVG/PNG masters.

Official SVGs are PNG-in-SVG (embedded base64). We extract the artwork,
resize, and emit:
  - optimized WebP/PNG for app use
  - slim SVG wrappers with embedded compressed PNG (keeps SVG format,
    preserves metallic quality, drops multi-MB payloads)
"""
from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(r"c:\Users\User\Desktop\VERONICA MARK")
LOGO = ROOT / "logo"
OUT = ROOT / "platform" / "public" / "brand"
APP = ROOT / "platform" / "app"
OUT.mkdir(parents=True, exist_ok=True)

DATA_URI_RE = re.compile(
    r"xlink:href=\"(data:image/(?:png|jpeg|jpg);base64,([^\"]+))\"",
    re.IGNORECASE,
)


def extract_largest_embedded_image(svg_path: Path) -> Image.Image:
    text = svg_path.read_text(encoding="utf-8", errors="ignore")
    matches = DATA_URI_RE.findall(text)
    if not matches:
        raise RuntimeError(f"No embedded raster in {svg_path.name}")
    best: Image.Image | None = None
    best_pixels = 0
    for _uri, b64 in matches:
        raw = base64.b64decode(b64)
        im = Image.open(io.BytesIO(raw)).convert("RGBA")
        pixels = im.width * im.height
        if pixels > best_pixels:
            best = im
            best_pixels = pixels
    assert best is not None
    return best


def load_master(stem: str) -> Image.Image:
    """Prefer PNG master when present; else extract from SVG."""
    png = LOGO / f"{stem}.png"
    svg = LOGO / f"{stem}.svg"
    if png.exists():
        return Image.open(png).convert("RGBA")
    if svg.exists():
        return extract_largest_embedded_image(svg)
    raise FileNotFoundError(stem)


def resize_max(im: Image.Image, max_side: int) -> Image.Image:
    out = im.copy()
    out.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    return out


def to_png_bytes(im: Image.Image) -> bytes:
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def write_svg_with_embedded_png(im: Image.Image, dest: Path, size: int = 512) -> None:
    """Official look as SVG container + compressed PNG (favicon/img safe)."""
    sized = resize_max(im, size)
    # Ensure square canvas for icons
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - sized.width) // 2
    y = (size - sized.height) // 2
    canvas.alpha_composite(sized, (x, y))
    b64 = base64.b64encode(to_png_bytes(canvas)).decode("ascii")
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{size}" height="{size}" viewBox="0 0 {size} {size}" role="img" aria-label="VERONICA MARK">
  <image width="{size}" height="{size}" xlink:href="data:image/png;base64,{b64}"/>
</svg>
"""
    dest.write_text(svg, encoding="utf-8")
    print(f"wrote {dest.name} ({dest.stat().st_size // 1024} KB)")


def save_webp(im: Image.Image, dest: Path, max_side: int, quality: int = 90) -> None:
    sized = resize_max(im, max_side)
    sized.save(dest, "WEBP", quality=quality, method=6)
    print(f"wrote {dest.name} ({dest.stat().st_size // 1024} KB)")


def save_apple_touch(im: Image.Image, dest: Path) -> None:
    sized = resize_max(im, 180)
    bg = Image.new("RGBA", (180, 180), (75, 36, 106, 255))
    x = (180 - sized.width) // 2
    y = (180 - sized.height) // 2
    bg.alpha_composite(sized, (x, y))
    bg.convert("RGB").save(dest, "PNG", optimize=True)
    print(f"wrote {dest.name} ({dest.stat().st_size // 1024} KB)")


def save_og(im: Image.Image, dest: Path) -> None:
    W, H = 1200, 630
    cream = (248, 244, 236)
    canvas = Image.new("RGB", (W, H), cream)
    logo = resize_max(im, 400)
    x = (W - logo.width) // 2
    y = (H - logo.height) // 2 - 8
    canvas.paste(logo, (x, y), logo)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle(
        [W // 2 - 160, y + logo.height + 16, W // 2 + 160, y + logo.height + 18],
        fill=(199, 162, 90),
    )
    canvas.save(dest, "WEBP", quality=88, method=6)
    print(f"wrote {dest.name} ({dest.stat().st_size // 1024} KB)")


def contrast(fg: tuple[int, int, int], bg: tuple[int, int, int]) -> float:
    def lin(c: int) -> float:
        x = c / 255
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

    def lum(rgb: tuple[int, int, int]) -> float:
        r, g, b = (lin(v) for v in rgb)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    L1, L2 = lum(fg), lum(bg)
    return (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)


def main() -> None:
    print("Loading official masters...")
    lockup = load_master("VM_Logo")
    icon = load_master("VM_Logo1")
    mono = load_master("VM_Logo2")
    # Logo3 if present (extra variant)
    logo3_path = LOGO / "VM_Logo3.png"
    logo3 = Image.open(logo3_path).convert("RGBA") if logo3_path.exists() else None

    print("Exporting web assets from official artwork...")
    write_svg_with_embedded_png(icon, OUT / "vm-icon.svg", 512)
    write_svg_with_embedded_png(mono, OUT / "vm-monogram.svg", 512)
    write_svg_with_embedded_png(lockup, OUT / "vm-lockup.svg", 768)
    if logo3 is not None:
        write_svg_with_embedded_png(logo3, OUT / "vm-logo3.svg", 512)
        save_webp(logo3, OUT / "vm-logo3-512.webp", 512)

    save_webp(icon, OUT / "vm-icon-512.webp", 512)
    save_webp(mono, OUT / "vm-monogram-512.webp", 512)
    save_webp(lockup, OUT / "vm-lockup-1024.webp", 1024)
    save_apple_touch(icon, OUT / "apple-touch-icon.png")
    save_og(icon, OUT / "og-default.webp")

    # Next.js app icon (same as brand icon)
    write_svg_with_embedded_png(icon, APP / "icon.svg", 512)

    pairs = [
        ("Charcoal on Cream", (26, 26, 26), (248, 244, 236)),
        ("White on Purple", (255, 255, 255), (75, 36, 106)),
        ("Purple on Cream", (75, 36, 106), (248, 244, 236)),
        ("Purple on White", (75, 36, 106), (255, 255, 255)),
        ("Gold on Cream", (199, 162, 90), (248, 244, 236)),
        ("Gold on Purple", (199, 162, 90), (75, 36, 106)),
        ("Cream on Purple", (248, 244, 236), (75, 36, 106)),
    ]
    print("\nContrast ratios (AA normal text >= 4.5, large >= 3.0):")
    for name, fg, bg in pairs:
        ratio = contrast(fg, bg)
        aa = "PASS" if ratio >= 4.5 else ("LARGE-ONLY" if ratio >= 3.0 else "FAIL")
        print(f"  {name:22} {ratio:5.2f}:1  {aa}")


if __name__ == "__main__":
    main()
