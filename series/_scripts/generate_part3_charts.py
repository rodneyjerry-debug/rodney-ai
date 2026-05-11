"""
Generate dashboard PNGs for Part 3 of The Vision 2030 Bank Scoreboard.
Capital Efficiency — Basel IV, RWA density, and the SAR 2.5B lever.
Matches Part 1/2 chart brand palette.
"""
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Rectangle
import numpy as np
import os

# Brand palette
NAVY   = "#0D1B2A"
ACCENT = "#1B4F72"
BLUE   = "#2874A6"
LIGHT  = "#F2F6FA"
GREY   = "#6C757D"
GOLD   = "#C9A227"
GREEN  = "#2E7D32"
AMBER  = "#B8860B"
RED    = "#A93226"

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["font.size"]   = 10
plt.rcParams["axes.edgecolor"]  = GREY
plt.rcParams["axes.labelcolor"] = NAVY
plt.rcParams["xtick.color"]     = GREY
plt.rcParams["ytick.color"]     = GREY
plt.rcParams["text.color"]      = NAVY

OUT_DIR = "/sessions/cool-elegant-cori/charts"
os.makedirs(OUT_DIR, exist_ok=True)

# ---------------------------------------------------------------
# Dashboard 1 — CAPITAL SQUEEZE
# CAR today vs requirements growing
# ---------------------------------------------------------------
def dashboard_1_capital_squeeze():
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=200)
    fig.patch.set_facecolor("white")

    categories = ["Minimum\n(Pillar 1)", "+ Conservation\nBuffer", "+ CCyB\n(May 2026)", "+ D-SIB\nBuffer", "Current\nSector CAR"]
    values = [8.0, 10.5, 11.5, 13.0, 19.2]
    colors = [BLUE, BLUE, ACCENT, ACCENT, NAVY]

    x = np.arange(len(categories))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    # Value labels
    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.3,
                f"{v}%", ha="center", va="bottom",
                fontsize=13, fontweight="bold", color=NAVY)

    # Headroom annotation
    ax.annotate("", xy=(4, 19.2), xytext=(4, 13.0),
                arrowprops=dict(arrowstyle="<->", color=GOLD, lw=2.5))
    ax.text(4.35, 16.1, "Headroom\n6.2pp", ha="left", va="center",
            fontsize=11, fontweight="bold", color=GOLD)

    # But shrinking note
    ax.text(4.35, 14.5, "(shrinking as\nbalance sheets grow)", ha="left", va="center",
            fontsize=8, color=GREY, style="italic")

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9)
    ax.set_ylim(0, 23)
    ax.set_ylabel("% of RWA", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    # Title
    fig.text(0.12, 0.95, "Capital adequacy  //  Requirements vs actual (Saudi banking sector)",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91, "The buffer looks comfortable today — but every new requirement eats into deployment capacity",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p3_1_capital_squeeze.png", bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p3_1_capital_squeeze.png")


# ---------------------------------------------------------------
# Dashboard 2 — AT1 SUKUK ISSUANCE ACCELERATION
# ---------------------------------------------------------------
def dashboard_2_at1_issuance():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=200)
    fig.patch.set_facecolor("white")

    years = ["2022", "2023", "2024", "2025\n(H1)", "2026E\n(Fitch)"]
    values = [1.5, 1.8, 3.2, 4.2, 10.0]
    colors = [GREY, GREY, BLUE, ACCENT, NAVY]

    x = np.arange(len(years))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    for bar, v in zip(bars, values):
        label = f"${v}B"
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.2,
                label, ha="center", va="bottom",
                fontsize=13, fontweight="bold", color=NAVY)

    # Growth annotation
    ax.annotate("+110%\nYoY", xy=(3, 4.2), xytext=(3.4, 5.8),
                fontsize=10, fontweight="bold", color=GOLD,
                arrowprops=dict(arrowstyle="->", color=GOLD, lw=1.5))

    ax.set_xticks(x)
    ax.set_xticklabels(years, fontsize=10)
    ax.set_ylim(0, 12)
    ax.set_ylabel("USD Billion", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.12, 0.95, "Saudi bank AT1 sukuk issuance  //  The signal in the capital stack",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91, "Organic capital generation alone cannot keep pace with balance sheet growth",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p3_2_at1_issuance.png", bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p3_2_at1_issuance.png")


# ---------------------------------------------------------------
# Dashboard 3 — THE FOUR MOVES (horizontal bar chart)
# ---------------------------------------------------------------
def dashboard_3_four_moves():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=200)
    fig.patch.set_facecolor("white")

    moves = [
        "Portfolio risk-weight\noptimisation",
        "Securitisation &\nbalance sheet recycling",
        "Collateral optimisation\n& data quality",
        "IRB migration &\nmodel sophistication",
    ]
    low =  [0.1, 0.2, 0.1, 0.1]
    base = [0.5, 0.7, 0.5, 0.8]
    high = [1.0, 1.5, 0.8, 2.0]

    y = np.arange(len(moves))
    h = 0.22

    bars_low = ax.barh(y + h, low, h, color=GREY, edgecolor="white", linewidth=0.5, label="Low")
    bars_base = ax.barh(y, base, h, color=BLUE, edgecolor="white", linewidth=0.5, label="Base")
    bars_high = ax.barh(y - h, high, h, color=NAVY, edgecolor="white", linewidth=0.5, label="High")

    # Value labels
    for bars, vals in [(bars_low, low), (bars_base, base), (bars_high, high)]:
        for bar, v in zip(bars, vals):
            ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2,
                    f"{v}", ha="left", va="center", fontsize=10, color=NAVY, fontweight="bold")

    ax.set_yticks(y)
    ax.set_yticklabels(moves, fontsize=10)
    ax.set_xlim(0, 2.8)
    ax.set_xlabel("SAR Billion / year", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.legend(loc="lower right", fontsize=9, framealpha=0.9)

    # Total annotation
    ax.text(2.4, 3.6, "TOTAL", fontsize=9, fontweight="bold", color=GREY, ha="center")
    ax.text(2.4, 3.2, "Base: 2.5", fontsize=11, fontweight="bold", color=BLUE, ha="center")

    fig.text(0.12, 0.95, "The four moves  //  Capital Efficiency lever build (SAR B / year)",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91, "All four pathways operate on the existing balance sheet — no new products or customers required",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p3_3_four_moves.png", bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p3_3_four_moves.png")


# ---------------------------------------------------------------
# Dashboard 4 — BASE vs HIGH CASE COMPARISON (visual meter)
# ---------------------------------------------------------------
def dashboard_4_base_vs_high():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=200)
    fig.patch.set_facecolor("white")

    categories = ["Low\n(comply only)", "Base\n(2 pathways)", "High\n(full programme)"]
    values = [0.5, 2.5, 5.3]
    colors = [GREY, BLUE, NAVY]

    x = np.arange(len(categories))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.15,
                f"SAR {v}B", ha="center", va="bottom",
                fontsize=14, fontweight="bold", color=NAVY)

    # Annotations for what each requires
    annotations = [
        "Bare minimum\nBasel IV compliance",
        "Coordinated programme\nacross 2+ pathways",
        "Institution-wide transformation\nBoard-level sponsorship"
    ]
    for i, (bar, ann) in enumerate(zip(bars, annotations)):
        ax.text(bar.get_x() + bar.get_width()/2, -0.7,
                ann, ha="center", va="top",
                fontsize=8, color=GREY, style="italic")

    # Multiplier
    ax.annotate("10.6×", xy=(2, 5.3), xytext=(1, 5.0),
                fontsize=14, fontweight="bold", color=GOLD,
                arrowprops=dict(arrowstyle="->", color=GOLD, lw=2))

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_ylim(-1.5, 7)
    ax.set_ylabel("SAR Billion / year", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.12, 0.95, "Capital Efficiency lever  //  Low vs Base vs High (SAR B / year)",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91, "The difference is not technology — it is governance",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0.05, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p3_4_base_vs_high.png", bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p3_4_base_vs_high.png")


# ---------------------------------------------------------------
# HERO BANNER — Part 3 style
# ---------------------------------------------------------------
def hero_part3():
    fig = plt.figure(figsize=(10, 6.67), dpi=200)
    fig.patch.set_facecolor(NAVY)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6.67)
    ax.axis("off")
    ax.set_facecolor(NAVY)

    # Series tag
    ax.text(0.6, 6.15, "SERIES 03  //  PART 3 OF 5  //  CAPITAL EFFICIENCY",
            fontsize=10, color="#BFD4E8", fontweight="bold", family="DejaVu Sans")

    # Main stat
    ax.text(0.6, 4.2, "SAR 2.5B",
            fontsize=56, color="white", fontweight="bold", family="DejaVu Sans")

    # Subtitle
    ax.text(0.6, 3.5, "released capital per year, in the Base case",
            fontsize=14, color=GOLD, fontweight="bold", family="DejaVu Sans")
    ax.text(0.6, 3.0, "hiding inside every Saudi bank's balance sheet.",
            fontsize=12, color="#BFD4E8", family="DejaVu Sans")

    # Three stat boxes at bottom
    box_y = 1.0
    box_h = 1.2
    box_w = 2.7
    gap = 0.35

    stats = [
        ("CAPITAL", "+1.5-2.5pt", "ROE from freed RWA"),
        ("BUFFER", "72.5%", "output floor by 2028"),
        ("AT1 GROWTH", "+110%", "sukuk issuance YoY"),
    ]

    for i, (label, value, sub) in enumerate(stats):
        bx = 0.6 + i * (box_w + gap)
        # Box background
        rect = FancyBboxPatch((bx, box_y), box_w, box_h,
                              boxstyle="round,pad=0.05",
                              facecolor=ACCENT, edgecolor="#2874A6", linewidth=1)
        ax.add_patch(rect)
        # Label
        ax.text(bx + 0.2, box_y + box_h - 0.25, label,
                fontsize=8, color="#BFD4E8", fontweight="bold",
                )
        # Value
        ax.text(bx + 0.2, box_y + 0.45, value,
                fontsize=22, color=GOLD, fontweight="bold", family="DejaVu Sans")
        # Sub
        ax.text(bx + 0.2, box_y + 0.12, sub,
                fontsize=8, color="#BFD4E8")

    # Byline at bottom
    ax.text(0.6, 0.35, "BY RODNEY COUTINHO  //  EXECUTIVE ADVISOR ON AI  //  BANKING, CAPITAL MARKETS & SOVEREIGN INSTITUTIONS  //  MIDDLE EAST",
            fontsize=7, color="#7A98B3", fontweight="bold")

    fig.savefig(f"{OUT_DIR}/hero_part3.png", bbox_inches="tight", facecolor=NAVY, dpi=200)
    plt.close()
    print("✓ hero_part3.png")


# Run all
if __name__ == "__main__":
    dashboard_1_capital_squeeze()
    dashboard_2_at1_issuance()
    dashboard_3_four_moves()
    dashboard_4_base_vs_high()
    hero_part3()
    print("\nAll Part 3 charts generated.")
