"""
Generate hero banner for Part 4 using the Ecosystem boardroom image.
Full image as background (no cropping), with series tag, main stat,
subtitle, and three stat boxes overlaid at the bottom.
Same template as Part 3 hero.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

# Target dimensions — match Part 1/2/3 hero aspect ratio
W, H = 1400, 933

# Brand palette
NAVY = (13, 27, 42)
NAVY_ALPHA = (13, 27, 42, 200)
GOLD = (201, 162, 39)
WHITE = (255, 255, 255)
LIGHT_BLUE = (191, 212, 232)
DIM_BLUE = (122, 152, 179)
BLUE = (40, 116, 166)
ACCENT = (27, 79, 114)

# Load Ecosystem image
photo_path = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/_brand-assets/Ecosystem.jpg"
photo = Image.open(photo_path).convert("RGB")

# Scale to fill W×H
scale = max(W / photo.width, H / photo.height)
new_w = int(photo.width * scale)
new_h = int(photo.height * scale)
photo = photo.resize((new_w, new_h), Image.LANCZOS)

# Center crop to exact W×H
left = (new_w - W) // 2
top = (new_h - H) // 2
photo = photo.crop((left, top, left + W, top + H))

# Darken to 0.55 brightness
enhancer = ImageEnhance.Brightness(photo)
photo = enhancer.enhance(0.55)

img = photo.copy()
draw = ImageDraw.Draw(img)

# Semi-transparent overlay on left side for text area
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)

# Left gradient overlay for text readability
for x in range(700):
    alpha = int(180 * (1 - x / 700))
    overlay_draw.line([(x, 0), (x, H)], fill=(13, 27, 42, alpha))

# Bottom strip for stat boxes
overlay_draw.rectangle([0, H - 200, W, H], fill=(13, 27, 42, 220))

img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
draw = ImageDraw.Draw(img)

# Load fonts
try:
    font_series = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_stat_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 90)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    font_sub2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    font_box_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_box_value = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    font_box_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    font_byline = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 11)
    font_name = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
except:
    font_series = ImageFont.load_default()

# Blue accent triangle (top-left)
draw.polygon([(0, 0), (80, 0), (0, 160)], fill=BLUE)
draw.polygon([(0, 0), (60, 0), (0, 120)], fill=(30, 90, 130))

# Series tag
draw.text((90, 50), "SERIES 04  //  PART 4 OF 5  //  SOVEREIGN ECOSYSTEM", fill=GOLD, font=font_series)

# Main stat
draw.text((90, 150), "SAR 7.1B", fill=WHITE, font=font_stat_large)

# Subtitle
draw.text((90, 270), "Sovereign demand flowing through banks, Base case.", fill=GOLD, font=font_subtitle)
draw.text((90, 310), "PIF, HUMAIN and the Vision Realisation", fill=WHITE, font=font_sub2)
draw.text((90, 338), "Programmes are the demand side of AI.", fill=WHITE, font=font_sub2)

# Name and title (on the left, below subtitle)
draw.text((90, 400), "RODNEY COUTINHO", fill=WHITE, font=font_name)
draw.text((90, 428), "Executive Advisor on AI  //  Middle East", fill=LIGHT_BLUE, font=font_title)

# Three stat boxes at bottom
box_y = H - 175
box_h = 120
box_w = 370
gap = 30
box_start_x = 90

stats = [
    ("HUMAIN STACK", "$47B+", "announced commitments"),
    ("PIF AUM TARGET", "$2.67T", "by 2030 (April 2025 revision)"),
    ("GIGA CONTRACTS", "$435B", "awarded since 2022 (~32% GDP)"),
]

for i, (label, value, sub) in enumerate(stats):
    bx = box_start_x + i * (box_w + gap)
    # Box with gold border
    draw.rectangle([bx, box_y, bx + box_w, box_y + box_h], fill=NAVY, outline=GOLD, width=2)
    # Label
    draw.text((bx + 20, box_y + 12), label, fill=LIGHT_BLUE, font=font_box_label)
    # Value
    draw.text((bx + 20, box_y + 32), value, fill=GOLD, font=font_box_value)
    # Sub
    draw.text((bx + 20, box_y + 80), sub, fill=LIGHT_BLUE, font=font_box_sub)

# Byline at very bottom
byline = "BY RODNEY COUTINHO  //  EXECUTIVE ADVISOR ON AI  //  BANKING, CAPITAL MARKETS & SOVEREIGN INSTITUTIONS  //  MIDDLE EAST"
draw.text((90, H - 38), byline, fill=DIM_BLUE, font=font_byline)

# Save
out_path = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/part-4-sovereign-ecosystem/charts/hero_part4.png"
img.save(out_path, "PNG", quality=95)
print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")
