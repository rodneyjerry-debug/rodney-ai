"""
Part 2 Visual Infographic Panels
Generates:
  09_race_snapshot.png   — 4-column race status (page 1 embed)
  10_race_detail.png     — full-page race comparison infographic
  11_what_changes.png    — full-page "what tokenization changes" with icons
  12_series_tracker.png  — 5-node journey progress bar (closing card)
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand/"
os.makedirs(OUT_DIR, exist_ok=True)

NAVY   = (13, 27, 42)
ACCENT = (27, 79, 114)
BLUE   = (40, 116, 166)
SOFT   = (191, 212, 232)
LIGHT  = (242, 246, 250)
GOLD   = (201, 162, 39)
WHITE  = (255, 255, 255)
INK    = (33, 37, 41)
GREY   = (108, 117, 125)
GREEN  = (39, 174, 96)
AMBER  = (243, 156, 18)
RED    = (231, 76, 60)

def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def text_width(draw, text, f):
    bbox = draw.textbbox((0, 0), text, font=f)
    return bbox[2] - bbox[0]

# ============================================================
# 1. RACE SNAPSHOT (compact, for page 1 embed)
#    ~1240 x 320 — fits within the DOCX page width
# ============================================================
def make_race_snapshot():
    W, H = 1240, 340
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Title
    ft = font(22, bold=True)
    d.text((30, 20), "THE GLOBAL RACE  //  WHO'S MOVING?", font=ft, fill=GOLD)
    d.rectangle([30, 52, 400, 54], fill=GOLD)

    # Four columns: Saudi, UAE, Malaysia, Global
    cols = [
        ("SAUDI ARABIA",  "SANDBOX",      AMBER, [
            "CMA FinTech Lab active",
            "SAR 3.4B pilot volume",
            "SAMA stablecoin dev",
            "No live sukuk on-chain",
        ]),
        ("UAE",           "LIVE",         GREEN, [
            "FAB + HSBC Orion bond",
            "Listed on ADX",
            "DFSA crypto rules (Jan)",
            "ADGM digital licensing",
        ]),
        ("MALAYSIA",      "PILOT",        BLUE,  [
            "Khazanah + CIMB sukuk",
            "SC oversight framework",
            "Workstreams to 2026",
            "Institutional backing",
        ]),
        ("GLOBAL",        "ACCELERATING", GREEN, [
            "UK: HSBC blockchain gilt",
            "HK: 7 banks deposits",
            "$18.6B on-chain RWAs",
            "$2T+ projected by 2030",
        ]),
    ]

    col_w = (W - 60 - 30) // 4  # 4 cols with gaps
    y_top = 75

    for i, (name, status, status_color, bullets) in enumerate(cols):
        x = 30 + i * (col_w + 10)

        # Column background
        d.rounded_rectangle([x, y_top, x + col_w, y_top + 245], radius=8, fill=(20, 35, 55))

        # Country name
        fn = font(17, bold=True)
        d.text((x + 12, y_top + 12), name, font=fn, fill=WHITE)

        # Status badge
        fs = font(14, bold=True)
        sw = text_width(d, status, fs)
        badge_x = x + 12
        badge_y = y_top + 38
        d.rounded_rectangle([badge_x, badge_y, badge_x + sw + 16, badge_y + 24], radius=4, fill=status_color)
        d.text((badge_x + 8, badge_y + 3), status, font=fs, fill=WHITE)

        # Bullet points
        fb = font(13)
        for j, bullet in enumerate(bullets):
            by = y_top + 75 + j * 38
            d.text((x + 12, by), "•", font=fb, fill=GOLD)
            d.text((x + 26, by), bullet, font=fb, fill=SOFT)

    img.save(OUT_DIR + "09_race_snapshot.png", "PNG")
    print(f"Saved: 09_race_snapshot.png ({os.path.getsize(OUT_DIR + '09_race_snapshot.png')} bytes)")


# ============================================================
# 2. RACE DETAIL (full-page infographic, ~1240 x 800)
# ============================================================
def make_race_detail():
    W, H = 1240, 860
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Header bar
    d.rectangle([0, 0, W, 70], fill=NAVY)
    ft = font(26, bold=True)
    d.text((30, 18), "THE RACE  //  WHO IS MOVING AND WHO IS STILL IN SANDBOX", font=ft, fill=WHITE)

    # Subheading
    fs = font(16)
    d.text((30, 85), "Regulatory readiness and live deployments across key markets as of Q1 2026", font=fs, fill=GREY)

    # Country rows — each is a wide card
    countries = [
        {
            "name": "SAUDI ARABIA", "flag_color": (0, 128, 0), "status": "SANDBOX",
            "status_color": AMBER, "score": 2,
            "items": [
                ("Tokenized sukuk", "Sandbox only — CMA FinTech Lab"),
                ("Tokenized deposits", "Not live"),
                ("Real estate / RWA", "REGA blockchain fund — early stage"),
                ("Regulatory", "CMA sandbox + digital pilot; SAMA stablecoin in dev"),
                ("Stablecoins", "SAMA developing — not yet announced"),
            ]
        },
        {
            "name": "UAE", "flag_color": (206, 17, 38), "status": "LIVE",
            "status_color": GREEN, "score": 5,
            "items": [
                ("Tokenized bonds", "FAB + HSBC Orion — listed on ADX"),
                ("Tokenized deposits", "Not live"),
                ("Real estate / RWA", "DLD + ADGM blockchain title registry"),
                ("Regulatory", "DFSA crypto rules (Jan 2026); ADGM digital licensing (Jun 2025)"),
                ("Stablecoins", "AED Coin (regulated) in pipeline"),
            ]
        },
        {
            "name": "MALAYSIA", "flag_color": (0, 0, 128), "status": "PILOT",
            "status_color": BLUE, "score": 3,
            "items": [
                ("Tokenized sukuk", "Khazanah + CIMB — SC oversight"),
                ("Tokenized deposits", "BNM pilot — HR 7 bank pilot"),
                ("Real estate / RWA", "Early stage"),
                ("Regulatory", "SC + BNM joint framework — workstreams to 2026"),
                ("Stablecoins", "Not announced"),
            ]
        },
        {
            "name": "GLOBAL BENCHMARKS", "flag_color": BLUE, "status": "ACCELERATING",
            "status_color": GREEN, "score": 5,
            "items": [
                ("UK", "HSBC appointed for blockchain gilt pilot"),
                ("Hong Kong", "7 banks — tokenized deposit settlement through 2026"),
                ("On-chain RWAs", "$18.6B total value (2025), tripling YoY"),
                ("Projected market", "$2T+ tokenized assets by 2030 (conservative)"),
                ("Infrastructure", "Multiple platforms live — Orion, Canton, Fireblocks"),
            ]
        },
    ]

    y = 115
    for country in countries:
        row_h = 170
        # Card background
        d.rounded_rectangle([20, y, W - 20, y + row_h], radius=10, fill=LIGHT)

        # Left accent bar
        d.rectangle([20, y, 28, y + row_h], fill=country["flag_color"])

        # Country name and status
        fn = font(20, bold=True)
        d.text((45, y + 12), country["name"], font=fn, fill=NAVY)

        # Status badge
        fb = font(14, bold=True)
        sw = text_width(d, country["status"], fb)
        bx = 45 + text_width(d, country["name"], fn) + 20
        d.rounded_rectangle([bx, y + 13, bx + sw + 16, y + 35], radius=4, fill=country["status_color"])
        d.text((bx + 8, y + 15), country["status"], font=fb, fill=WHITE)

        # Readiness dots
        dot_x = W - 100
        for di in range(5):
            fill = GOLD if di < country["score"] else (220, 225, 230)
            d.ellipse([dot_x + di * 18, y + 16, dot_x + di * 18 + 12, y + 28], fill=fill)

        # Detail items in two columns
        fi = font(13)
        fl = font(13, bold=True)
        col1_items = country["items"][:3]
        col2_items = country["items"][3:]

        for j, (label, detail) in enumerate(col1_items):
            iy = y + 48 + j * 36
            d.text((45, iy), label + ":", font=fl, fill=ACCENT)
            d.text((45 + text_width(d, label + ": ", fl), iy), detail, font=fi, fill=INK)

        for j, (label, detail) in enumerate(col2_items):
            iy = y + 48 + j * 36
            d.text((620, iy), label + ":", font=fl, fill=ACCENT)
            d.text((620 + text_width(d, label + ": ", fl), iy), detail, font=fi, fill=INK)

        y += row_h + 12

    img.save(OUT_DIR + "10_race_detail.png", "PNG")
    print(f"Saved: 10_race_detail.png ({os.path.getsize(OUT_DIR + '10_race_detail.png')} bytes)")


# ============================================================
# 3. WHAT TOKENIZATION CHANGES (icon-driven, ~1240 x 500)
# ============================================================
def make_what_changes():
    W, H = 1240, 520
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Header bar
    d.rectangle([0, 0, W, 70], fill=NAVY)
    ft = font(26, bold=True)
    d.text((30, 18), "WHAT TOKENIZED SUKUK ACTUALLY CHANGES", font=ft, fill=WHITE)

    fs = font(15)
    d.text((30, 85), "Tokenization is not a technology upgrade. It rewrites four things simultaneously.", font=fs, fill=GREY)

    # Four cards with icon circles
    cards = [
        ("SETTLEMENT",       "T+0",         "Instant settlement vs\nT+2 today. Eliminates\ncounterparty risk and\nfrees trapped liquidity.", BLUE),
        ("SHARIAH\nCOMPLIANCE", "SC",       "Smart contracts embed\ncompliance into the asset.\nAutomated purification,\nprofit distribution, audit.", ACCENT),
        ("FRACTIONAL\nACCESS",   "FA",       "Fractional ownership\nopens institutional sukuk\nto retail investors. SAR\n1,000 minimum instead\nof SAR 1M.", GREEN),
        ("CAPITAL\nEFFICIENCY",  "CE",       "Lower issuance costs,\nreduced intermediary\nfees, and RWA savings\nthat compound into the\nROE story.", GOLD),
    ]

    card_w = (W - 80 - 45) // 4
    y_top = 120

    for i, (title, icon_text, description, color) in enumerate(cards):
        x = 30 + i * (card_w + 15)

        # Card background
        d.rounded_rectangle([x, y_top, x + card_w, y_top + 370], radius=12, fill=LIGHT)

        # Icon circle
        cx = x + card_w // 2
        cy = y_top + 55
        r = 35
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
        fi = font(22, bold=True)
        tw = text_width(d, icon_text, fi)
        d.text((cx - tw // 2, cy - 13), icon_text, font=fi, fill=WHITE)

        # Title
        fn = font(16, bold=True)
        lines = title.split("\n")
        ty = y_top + 105
        for line in lines:
            lw = text_width(d, line, fn)
            d.text((cx - lw // 2, ty), line, font=fn, fill=NAVY)
            ty += 22

        # Description
        fd = font(13)
        desc_lines = description.split("\n")
        dy = y_top + 165
        for line in desc_lines:
            d.text((x + 18, dy), line, font=fd, fill=INK)
            dy += 22

        # Bottom accent line
        d.rectangle([x + 15, y_top + 350, x + card_w - 15, y_top + 355], fill=color)

    img.save(OUT_DIR + "11_what_changes.png", "PNG")
    print(f"Saved: 11_what_changes.png ({os.path.getsize(OUT_DIR + '11_what_changes.png')} bytes)")


# ============================================================
# 4. SERIES TRACKER (horizontal journey, ~1240 x 200)
# ============================================================
def make_series_tracker():
    W, H = 1240, 260
    img = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(img)

    # Title
    ft = font(22, bold=True)
    d.text((30, 20), "THE FULL SERIES  //  VISION 2030 BANK SCOREBOARD", font=ft, fill=NAVY)
    d.rectangle([30, 52, 520, 54], fill=GOLD)

    parts = [
        ("01", "Monetization", "The $295B fee-\nincome unlock", True),
        ("02", "Tokenization", "Which institution puts\nthe first sukuk on-chain?", True),
        ("03", "Capital Efficiency", "RWA optimisation\n+ Basel IV", False),
        ("04", "AI-Led Sovereign", "PIF, Vision Realisation\nPrograms", False),
        ("05", "The Scoreboard", "ROE, market cap,\nthe one board question", False),
    ]

    node_y = 100
    node_r = 28
    start_x = 80
    gap = (W - 160) // 4  # spacing between nodes

    for i, (num, title, desc, done) in enumerate(parts):
        cx = start_x + i * gap
        is_current = (i == 1)  # Part 2

        # Connecting line to next node
        if i < 4:
            next_x = start_x + (i + 1) * gap
            line_color = GOLD if done and i < 1 else (220, 225, 230)
            d.line([(cx + node_r, node_y), (next_x - node_r, node_y)], fill=line_color, width=3)

        # Node circle
        if is_current:
            # Outer glow ring
            d.ellipse([cx - node_r - 6, node_y - node_r - 6, cx + node_r + 6, node_y + node_r + 6],
                      outline=GOLD, width=3)
            d.ellipse([cx - node_r, node_y - node_r, cx + node_r, node_y + node_r], fill=GOLD)
        elif done:
            d.ellipse([cx - node_r, node_y - node_r, cx + node_r, node_y + node_r], fill=ACCENT)
        else:
            d.ellipse([cx - node_r, node_y - node_r, cx + node_r, node_y + node_r], fill=(220, 225, 230))

        # Number
        fn = font(20, bold=True)
        nw = text_width(d, num, fn)
        d.text((cx - nw // 2, node_y - 12), num, font=fn, fill=WHITE if (done or is_current) else GREY)

        # Title below
        fl = font(13, bold=True)
        tw = text_width(d, title, fl)
        d.text((cx - tw // 2, node_y + 36), title, font=fl, fill=NAVY if (done or is_current) else GREY)

        # "YOU ARE HERE" marker
        if is_current:
            fm = font(11, bold=True)
            marker = "YOU ARE HERE"
            mw = text_width(d, marker, fm)
            d.rounded_rectangle([cx - mw // 2 - 8, node_y - node_r - 26, cx + mw // 2 + 8, node_y - node_r - 8],
                                radius=4, fill=GOLD)
            d.text((cx - mw // 2, node_y - node_r - 24), marker, font=fm, fill=WHITE)

    img.save(OUT_DIR + "12_series_tracker.png", "PNG")
    print(f"Saved: 12_series_tracker.png ({os.path.getsize(OUT_DIR + '12_series_tracker.png')} bytes)")


# ============================================================
# RUN ALL
# ============================================================
make_race_snapshot()
make_race_detail()
make_what_changes()
make_series_tracker()
print("All Part 2 visuals generated.")
