"""
Generate Enterprise.AI masthead for Misconceptions series carousel.
Replaces old RODNEY.AI masthead. Matches exact dimensions (3564x440).
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 3564, 440

# Brand palette
NAVY = (13, 27, 42)
GOLD = (201, 162, 39)
WHITE = (255, 255, 255)
LIGHT_BLUE = (191, 212, 232)
DIM_BLUE = (122, 152, 179)
BLUE = (40, 116, 166)

# Create base
img = Image.new("RGBA", (W, H), NAVY)
draw = ImageDraw.Draw(img)

# Load fonts
try:
    font_brand = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
    font_tagline = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_series = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    font_series_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)
    font_sgw = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except:
    font_brand = ImageFont.load_default()

# SCALE · GOVERN · UNLOCK box (left side)
box_x, box_y = 40, 60
box_w, box_h = 260, 320
# White rounded rect with gold border
draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=12, fill=WHITE, outline=GOLD, width=4)

# SCALE
draw.text((box_x + 50, box_y + 40), "SCALE", fill=NAVY, font=font_sgw)
# GOVERN
draw.text((box_x + 36, box_y + 130), "GOVERN", fill=GOLD, font=font_sgw)
# UNLOCK
draw.text((box_x + 34, box_y + 220), "UNLOCK", fill=NAVY, font=font_sgw)

# ENTERPRISE.AI (main brand name)
draw.text((340, 100), "ENTERPRISE.AI", fill=WHITE, font=font_brand)

# Tagline
draw.text((340, 200), "RODNEY COUTINHO  //  EXECUTIVE ADVISOR ON AI  //  FINANCIAL SERVICES  //  MIDDLE EAST & EUROPE", fill=DIM_BLUE, font=font_tagline)

# Right side: series identifier
series_text = "MISCONCEPTIONS & FIRST PRINCIPLES"
bbox = draw.textbbox((0, 0), series_text, font=font_series)
text_w = bbox[2] - bbox[0]
draw.text((W - text_w - 60, 110), series_text, fill=GOLD, font=font_series)

series_sub = "AI IN FINANCIAL SERVICES  //  4-PART SERIES"
bbox2 = draw.textbbox((0, 0), series_sub, font=font_series_sub)
text_w2 = bbox2[2] - bbox2[0]
draw.text((W - text_w2 - 60, 170), series_sub, fill=DIM_BLUE, font=font_series_sub)

# Bottom gold line
draw.rectangle([0, H - 8, W, H], fill=GOLD)

# Blue accent line above the gold
draw.rectangle([0, H - 12, W, H - 8], fill=BLUE)

# Save
out_dir = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/_brand-assets"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "masthead_enterprise_ai.png")
img.save(out_path, "PNG", quality=95)
print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")
