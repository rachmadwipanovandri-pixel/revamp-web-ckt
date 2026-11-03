"""Crop transparent padding without changing Cekat's original product imagery.

Run with python3; Pillow is required. Original files are never overwritten.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/images'
OUT = SOURCE / 'exploratory'


def main():
    OUT.mkdir(exist_ok=True)
    sources = [path for folder in ('chat', 'crm', 'marketing', 'order')
               for path in (SOURCE / folder).glob('*.png')]
    sources.append(SOURCE / 'home/hero-dashboard.png')
    for source in sources:
        with Image.open(source) as original:
            image = original.convert('RGBA')
            # Ignore barely visible export shadows while retaining all content.
            bounds = image.getchannel('A').point(lambda alpha: 255 if alpha > 18 else 0).getbbox()
            if bounds:
                left, top, right, bottom = bounds
                image = image.crop((max(0, left - 12), max(0, top - 12),
                                    min(image.width, right + 12), min(image.height, bottom + 12)))
            image.thumbnail((1400, 1100), Image.Resampling.LANCZOS)
            name = '-'.join(source.relative_to(SOURCE).with_suffix('').parts) + '.webp'
            image.save(OUT / name, 'WEBP', quality=88, method=6)
            print(f'{name}: {image.width}x{image.height}')


if __name__ == '__main__':
    main()
