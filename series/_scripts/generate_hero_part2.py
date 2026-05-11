"""
Part 2 Hero Panel: Tokenization — $500B
Same visual language as Part 1 hero but with Part 2 content.
Output: /sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand/08_hero_part2.png
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

SRC = "/sessions/cool-amazing-ptolemy/mnt/CV/rodney_desk.png"
OUT = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand/08_hero_part2.png"
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# Brand palette (same as Part 1)
NAVY   = (13, 27, 42)
ACCENT = (27, 79, 114)
BLUE   = (40, 116, 166)
SOFT   = (191, 212, 232)
LIGHT  = (242, 246, 250)
GOLD   = (201, 162, 39)
WHITE  = (255, 255, 255)

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
# BACKGROUND — same as Part 1
# ============================================================
# Radial bloom center-left
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

# Grid lines
for x in range(0, W, 80):
    draw.line([(x, 0), (x, H)], fill=(20, 40, 60), width=1)
for y in range(0, H, 80):
    draw.line([(0, y), (W, y)], fill=(20, 40, 60), width=1)

# Corner accents (same as Part 1)
draw.polygon([(0, 0), (420, 0), (210, 160), (0, 160)], fill=ACCENT)
draw.polygon([(0, 0), (280, 0), (140, 100), (0, 100)], fill=BLUE)

# Chain-link pattern (subtle, bottom-left — blockchain metaphor)
for i in range(5):
    x0 = 100 + i * 150
    y0 = H - 550 + (i % 2) * 30
    draw.rounded_rectangle(
        [x0, y0, x0 + 110, y0 + 55],
        radius=10,
        outline=(BLUE[0], BLUE[1], BLUE[2], 35),
        width=2
    )
    if i < 4:
        draw.line([(x0 + 110, y0 + 28), (x0 + 150, y0 + 28 + (15 if i % 2 == 0 else -15))],
                  fill=(BLUE[0], BLUE[1], BLUE[2], 25), width=2)


# ============================================================
# SERIES LABEL (top-left) — gold rule underneath like Part 1
# ============================================================
f_series = load_font(38, bold=True)
draw.text((100, 80), "SERIES 01  //  PART 2 OF 5  //  TOKENIZATION", font=f_series, fill=GOLD)
draw.rectangle([(100, 130), (100 + 820, 138)], fill=GOLD)


# ============================================================
# PHOTO CHIP — top-right, preserve aspect ratio (same as Part 1)
# ============================================================
if os.path.exists(SRC):
    src = Image.open(SRC).convert("RGBA")
    SW, SH = src.size  # 1280 x 853

    # Target chip size — preserve aspect ratio
    CHIP_W = 720
    CHIP_H = int(CHIP_W * (SH / SW))  # ~480

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
    draw.text((CHIP_X, name_y), "RODNEY COUTINHO", font=f_chip_name, fill=WHITE)
    draw.text((CHIP_X, name_y + 52), "Executive Advisor on AI  //  Middle East", font=f_chip_title, fill=SOFT)


# ============================================================
# MEGA HEADLINE — $500B
# ============================================================
f_mega = load_font(360, bold=True)
f_sub = load_font(64, bold=True)
f_subline = load_font(44, bold=False)

mega_y = 340
draw.text((100, mega_y), "$500B", font=f_mega, fill=WHITE)

# Sub-headline
sub_y = mega_y + 420
draw.text((100, sub_y),
          "Which Saudi financial institution",
          font=f_sub, fill=GOLD)
draw.text((100, sub_y + 80),
          "puts the first sukuk on-chain?",
          font=f_sub, fill=GOLD)
draw.text((100, sub_y + 170),
          "GCC real-world asset tokenization opportunity by 2030.",
          font=f_subline, fill=LIGHT)


# ============================================================
# THREE HORIZONTAL DATA CALLOUTS (bottom strip — same layout as Part 1)
# ============================================================
f_card_label = load_font(40, bold=True)
f_card_num   = load_font(104, bold=True)
f_card_note  = load_font(32, bold=False)

callouts = [
    ("SUKUK",     "SAR 696B",    "Saudi listed sukuk & bonds"),
    ("GLOBAL",    "$1 Trillion", "outstanding sukuk (2025)"),
    ("ON-CHAIN",  "0",           "Saudi sukuk settled on-chain"),
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
# BOTTOM ADVISOR BAR (full width — same as Part 1)
# ============================================================
bar_h = 110
bar_y = H - bar_h
draw.rectangle([0, bar_y, W, H], fill=NAVY)
f_bar = load_font(28, bold=True)
draw.text((100, bar_y + 38),
          "BY RODNEY COUTINHO  //  EXECUTIVE ADVISOR ON AI  //  BANKING, CAPITAL MARKETS & SOVEREIGN INSTITUTIONS  //  MIDDLE EAST",
          font=f_bar, fill=WHITE)


# ============================================================
# SAVE
# ============================================================
final = canvas.convert("RGB")
final.save(OUT, "PNG")
print(f"Saved: {OUT} ({os.path.getsize(OUT)} bytes)")
