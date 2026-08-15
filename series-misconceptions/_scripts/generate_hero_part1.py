"""
Generate hero banner for Misconceptions Series Part 1 — Banks.
Uses the boardroom/ecosystem image as background with series branding.
"""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

# Target dimensions
W, H = 1400, 933

# Brand palette
NAVY = (13, 27, 42)
GOLD = (201, 162, 39)
WHITE = (255, 255, 255)
LIGHT_BLUE = (191, 212, 232)
DIM_BLUE = (122, 152, 179)
BLUE = (40, 116, 166)
ACCENT = (27, 79, 114)
RED_ACCENT = (178, 34, 34)  # For "misconception" visual

# Load boardroom image
photo_path = "/sessions/cool-elegant-cori/mnt/CV/Rodney.AI - Vision 2030 Bank Scoreboard Archive/04_Source_Assets/Ecosystem.jpg"
photo = Image.open(photo_path).convert("RGB")

# Scale to fill W×H
scale = max(W / photo.width, H / photo.height)
new_w = int(photo.width * scale)
new_h = int(photo.height * scale)
photo = photo.resize((new_w, new_h), Image.LANCZOS)

# Center crop
left = (new_w - W) // 2
top = (new_h - H) // 2
photo = photo.crop((left, top, left + W, top + H))

# Darken for text readability
enhancer = ImageEnhance.Brightness(photo)
photo = enhancer.enhance(0.5)

img = photo.copy()
draw = ImageDraw.Draw(img)

# Semi-transparent overlay
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)

# Left gradient overlay
for x in range(750):
    alpha = int(190 * (1 - x / 750))
    overlay_draw.line([(x, 0), (x, H)], fill=(13, 27, 42, alpha))

# Bottom strip
overlay_draw.rectangle([0, H - 200, W, H], fill=(13, 27, 42, 220))

img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
draw = ImageDraw.Draw(img)

# Load fonts
try:
    font_series = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
    font_main = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 52)
    font_main_lg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    font_sub2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    font_box_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_box_value = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
    font_box_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    font_byline = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 11)
    font_name = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_strike = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
except:
    font_series = ImageFont.load_default()

# Blue accent triangle (top-left)
draw.polygon([(0, 0), (80, 0), (0, 160)], fill=BLUE)
draw.polygon([(0, 0), (60, 0), (0, 120)], fill=(30, 90, 130))

# Series tag
draw.text((90, 50), "AI IN FS: MISCONCEPTIONS & FIRST PRINCIPLES  //  PART 1 OF 4  //  BANKS", fill=GOLD, font=font_series)

# Main headline — the misconception (struck through visually)
y_main = 120

# "AI should do" line
draw.text((90, y_main), '"AI should do', fill=(180, 180, 180), font=font_main)
# Strikethrough line
bbox1 = draw.textbbox((90, y_main), '"AI should do', font=font_main)
mid_y1 = (bbox1[1] + bbox1[3]) // 2
draw.line([(bbox1[0], mid_y1), (bbox1[2], mid_y1)], fill=RED_ACCENT, width=4)

# "everything."
draw.text((90, y_main + 65), 'everything."', fill=(180, 180, 180), font=font_main)
bbox2 = draw.textbbox((90, y_main + 65), 'everything."', font=font_main)
mid_y2 = (bbox2[1] + bbox2[3]) // 2
draw.line([(bbox2[0], mid_y2), (bbox2[2], mid_y2)], fill=RED_ACCENT, width=4)

# The first principle — bold and white
draw.text((90, y_main + 165), "AI orchestrates.", fill=WHITE, font=font_main_lg)
draw.text((90, y_main + 230), "Code computes.", fill=GOLD, font=font_main_lg)

# Subtitle
draw.text((90, y_main + 320), "A credit memo agent that costs $0.35", fill=LIGHT_BLUE, font=font_subtitle)
draw.text((90, y_main + 352), "and gets the numbers right every time.", fill=LIGHT_BLUE, font=font_subtitle)

# Name and title
draw.text((90, y_main + 410), "RODNEY COUTINHO", fill=WHITE, font=font_name)
draw.text((90, y_main + 438), "Executive Advisor on AI  //  Enterprise.AI", fill=LIGHT_BLUE, font=font_title)

# Three stat boxes at bottom
box_y = H - 175
box_h = 120
box_w = 370
gap = 30
box_start_x = 90

stats = [
    ("COST PER MEMO", "$0.35", "vs. $500 manual (4-6 hrs)"),
    ("RATIOS COMPUTED", "10", "deterministic, unit-tested"),
    ("COVENANTS DRAFTED", "18", "AI-generated, human-reviewed"),
]

for i, (label, value, sub) in enumerate(stats):
    bx = box_start_x + i * (box_w + gap)
    draw.rectangle([bx, box_y, bx + box_w, box_y + box_h], fill=NAVY, outline=GOLD, width=2)
    draw.text((bx + 20, box_y + 12), label, fill=LIGHT_BLUE, font=font_box_label)
    draw.text((bx + 20, box_y + 32), value, fill=GOLD, font=font_box_value)
    draw.text((bx + 20, box_y + 80), sub, fill=LIGHT_BLUE, font=font_box_sub)

# Byline at very bottom
byline = "ENTERPRISE.AI  //  AI STRATEGY, GOVERNANCE & DEPLOYMENT  //  BANKING  //  MIDDLE EAST & EUROPE"
draw.text((90, H - 38), byline, fill=DIM_BLUE, font=font_byline)

# Save
out_dir = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-1-banks/charts"
out_path = os.path.join(out_dir, "hero_part1.png")
img.save(out_path, "PNG", quality=95)
print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")
