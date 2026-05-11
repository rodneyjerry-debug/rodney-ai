"""
v4: Saudi story is the HERO. Photo is a small top-right corner element.
The $295B monetization narrative dominates the page; the portrait is a
credential chip rather than the main visual.

Output: /sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand/07_hero_part1.png
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

SRC = "/sessions/cool-amazing-ptolemy/mnt/CV/rodney_desk.png"
OUT = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand/07_hero_part1.png"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Brand palette
NAVY   = (13, 27, 42)
ACCENT = (27, 79, 114)
BLUE   = (40, 116, 166)
SOFT   = (191, 212, 232)
LIGHT  = (242, 246, 250)
GOLD   = (201, 162, 39)
WHITE  = (255, 255, 255)
GREY   = (108, 117, 125)

# ---- Canvas ----
W, H = 2560, 1706
canvas = Image.new("RGBA", (W, H), (NAVY[0], NAVY[1], NAVY[2], 255))
draw = ImageDraw.Draw(canvas)


def load_font(size, bold=False):
    paths_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    paths_reg = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in (paths_bold if bold else paths_reg):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


# ============================================================
# BACKGROUND — subtle data-viz atmosphere
# ============================================================
# Soft radial light bloom center-left (behind the mega number)
bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bloom)
cx, cy = int(W * 0.42), int(H * 0.46)
for r in range(1200, 0, -40):
    alpha = int(40 * (1 - r / 1200))
    shade = (ACCENT[0], ACCENT[1], ACCENT[2], alpha)
    bdraw.ellipse([cx - r, cy - int(r * 0.85), cx + r, cy + int(r * 0.85)], fill=shade)
bloom = bloom.filter(ImageFilter.GaussianBlur(radius=120))
canvas = Image.alpha_composite(canvas, bloom)
draw = ImageDraw.Draw(canvas)

# Thin grid lines (terminal-style)
for x in range(0, W, 80):
    draw.line([(x, 0), (x, H)], fill=(20, 40, 60), width=1)
for y in range(0, H, 80):
    draw.line([(0, y), (W, y)], fill=(20, 40, 60), width=1)

# Corner accent stripes
draw.polygon([(0, 0), (420, 0), (210, 160), (0, 160)], fill=ACCENT)
draw.polygon([(0, 0), (280, 0), (140, 100), (0, 100)], fill=BLUE)

# Faint ascending bars bottom-right (behind callouts area) — drawn before callouts
bar_left = W - 1000
bar_base = H - 560
bar_w = 70
bar_gap = 30
heights = [140, 210, 290, 380, 480, 590, 720, 860]
for i, bh in enumerate(heights):
    x0 = bar_left + i * (bar_w + bar_gap)
    x1 = x0 + bar_w
    y0 = bar_base - bh
    y1 = bar_base
    # faint, translucent-looking
    shade = (BLUE[0] // 3, BLUE[1] // 3 + 10, BLUE[2] // 3 + 20)
    draw.rectangle([x0, y0, x1, y1], fill=shade)
    draw.rectangle([x0, y0, x1, y0 + 6], fill=ACCENT)


# ============================================================
# EYEBROW — series line top-left
# ============================================================
f_eyebrow = load_font(42, bold=True)
draw.text((100, 80),
          "SERIES 01  //  PART 1 OF 5  //  MONETIZATION",
          font=f_eyebrow, fill=LIGHT)
draw.rectangle([(100, 150), (100 + 820, 158)], fill=GOLD)


# ============================================================
# PHOTO CHIP — small, top-right corner
# Use the source photo as-is (background text stays).
# Just resize and frame it.
# ============================================================
src = Image.open(SRC).convert("RGBA")
SW, SH = src.size  # 1280 x 853

# Target chip size — small, top-right, preserve aspect ratio
CHIP_W = 720
CHIP_H = int(CHIP_W * (SH / SW))  # 480

chip = src.resize((CHIP_W, CHIP_H), Image.LANCZOS)

# Chip position: top-right with margin
CHIP_X = W - CHIP_W - 100
CHIP_Y = 80

# Gold frame around the chip
frame_pad = 10
fx0 = CHIP_X - frame_pad
fy0 = CHIP_Y - frame_pad
fx1 = CHIP_X + CHIP_W + frame_pad
fy1 = CHIP_Y + CHIP_H + frame_pad
draw.rectangle([fx0, fy0, fx1, fy1], fill=GOLD)
# navy inner backplate
draw.rectangle([CHIP_X, CHIP_Y, CHIP_X + CHIP_W, CHIP_Y + CHIP_H], fill=NAVY)
# paste photo
canvas.paste(chip, (CHIP_X, CHIP_Y), chip)
draw = ImageDraw.Draw(canvas)

# Author label below the chip
f_chip_name = load_font(38, bold=True)
f_chip_title = load_font(24, bold=False)
name_y = CHIP_Y + CHIP_H + 30
draw.text((CHIP_X, name_y),
          "RODNEY COUTINHO",
          font=f_chip_name, fill=WHITE)
draw.text((CHIP_X, name_y + 52),
          "Executive Advisor on AI  //  Middle East",
          font=f_chip_title, fill=SOFT)


# ============================================================
# MEGA HEADLINE — $295B as the page hero
# Sized so it clears the photo chip in the top-right.
# Photo chip right edge ends at x = W - 100 = 2460, left edge at x = 1740.
# $295B sits at x=100 and must not extend past ~1700.
# ============================================================
f_mega   = load_font(360, bold=True)  # reduced from 560
f_sub    = load_font(64, bold=True)
f_subline = load_font(44, bold=False)

mega_y = 340
draw.text((100, mega_y), "$295B", font=f_mega, fill=WHITE)

# Sub-headline
sub_y = mega_y + 420
draw.text((100, sub_y),
          "The Saudi bank market cap unlock",
          font=f_sub, fill=GOLD)
draw.text((100, sub_y + 80),
          "hiding in plain sight between now and 2030.",
          font=f_subline, fill=LIGHT)


# ============================================================
# THREE HORIZONTAL DATA CALLOUTS (bottom strip)
# ============================================================
f_card_label = load_font(40, bold=True)
f_card_num   = load_font(104, bold=True)
f_card_note  = load_font(32, bold=False)

callouts = [
    ("REVENUE",  "+SAR 29.5B",  "fee income, ½ the gap to peers"),
    ("RISK",     "−20-30%",     "loss rate at frontier-AI banks"),
    ("CAPITAL",  "+1.5-2.5pt",  "ROE unlock from freed RWA"),
]

card_gap = 40
card_w   = (W - 200 - 2 * card_gap) // 3  # three across, 100 margin each side
card_h   = 320
card_top = H - card_h - 180  # leave room for bottom advisor bar

for i, (lbl, num, note) in enumerate(callouts):
    x0 = 100 + i * (card_w + card_gap)
    y0 = card_top
    x1 = x0 + card_w
    y1 = y0 + card_h
    # solid accent card
    draw.rectangle([x0, y0, x1, y1], fill=ACCENT)
    # gold top rule
    draw.rectangle([x0, y0, x1, y0 + 7], fill=GOLD)
    # label
    draw.text((x0 + 40, y0 + 40), lbl, font=f_card_label, fill=SOFT)
    # big number
    draw.text((x0 + 40, y0 + 100), num, font=f_card_num, fill=WHITE)
    # small note
    draw.text((x0 + 40, y0 + 240), note, font=f_card_note, fill=LIGHT)


# ============================================================
# BOTTOM ADVISOR BAR (full width)
# ============================================================
bar_h = 110
bar_y = H - bar_h
draw.rectangle([0, bar_y, W, H], fill=NAVY)
draw.rectangle([0, bar_y, W, bar_y + 5], fill=GOLD)

f_author = load_font(32, bold=True)
advisor_line = "BY RODNEY COUTINHO   //   EXECUTIVE ADVISOR ON AI   //   BANKING, CAPITAL MARKETS & SOVEREIGN INSTITUTIONS   //   MIDDLE EAST"
bbox = draw.textbbox((0, 0), advisor_line, font=f_author)
tw = bbox[2] - bbox[0]
tx = (W - tw) // 2
draw.text((tx, bar_y + 42), advisor_line, font=f_author, fill=LIGHT)


# ---- Save ----
final = canvas.convert("RGB")
final.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT}  ({os.path.getsize(OUT):,} bytes)  size={final.size}")
print(f"Chip size: {CHIP_W}x{CHIP_H} at ({CHIP_X},{CHIP_Y})")
