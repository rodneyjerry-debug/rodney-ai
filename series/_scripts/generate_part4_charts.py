"""
Generate dashboard PNGs for Part 4 of The Vision 2030 Bank Scoreboard.
Sovereign Ecosystem — PIF, HUMAIN, VRPs and the SAR 7.1B lever.
Matches Part 1/2/3 chart brand palette.
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

OUT_DIR = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/part-4-sovereign-ecosystem/charts"
os.makedirs(OUT_DIR, exist_ok=True)


# ---------------------------------------------------------------
# Dashboard 1 — SOVEREIGN AI INVESTMENT TIMELINE (HUMAIN/PIF flows)
# ---------------------------------------------------------------
def dashboard_1_sovereign_timeline():
    fig, ax = plt.subplots(figsize=(10, 4.4), dpi=200)
    fig.patch.set_facecolor("white")

    # HUMAIN-related committed investment (USD B), cumulative wave
    categories = [
        "HUMAIN\n(announced 2025)",
        "NVIDIA GPU\nprogramme",
        "AMD JV\n(2025)",
        "Google Cloud\n+ PIF AI hub",
        "AWS AI\nZone",
        "xAI stake\n(HUMAIN)",
        "Nat'l Infra\nFund framework",
    ]
    values = [10.0, 8.0, 10.0, 10.0, 5.0, 3.0, 1.2]
    colors = [NAVY, BLUE, ACCENT, BLUE, ACCENT, BLUE, GOLD]

    x = np.arange(len(categories))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.25,
                f"${v:.1f}B", ha="center", va="bottom",
                fontsize=11, fontweight="bold", color=NAVY)

    # Total annotation
    total = sum(values)
    ax.text(6.5, 9.5, f"Stack total\n~${total:.0f}B+",
            ha="right", va="top",
            fontsize=11, fontweight="bold", color=GOLD,
            bbox=dict(boxstyle="round,pad=0.5", facecolor=LIGHT,
                      edgecolor=GOLD, linewidth=1.5))

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9)
    ax.set_ylim(0, 12.5)
    ax.set_ylabel("USD Billion (announced commitments)", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.12, 0.95,
             "The HUMAIN stack  //  Announced sovereign-AI commitments touching the Saudi banking system",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91,
             "Each bar is a flow that lands somewhere on a Saudi bank's balance sheet",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p4_1_sovereign_timeline.png",
                bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p4_1_sovereign_timeline.png")


# ---------------------------------------------------------------
# Dashboard 2 — PIF AUM & PORTFOLIO AI EXPOSURE
# ---------------------------------------------------------------
def dashboard_2_pif_portfolio():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=200,
                                    gridspec_kw={"width_ratios": [1.1, 1]})
    fig.patch.set_facecolor("white")

    # Left: PIF AUM trajectory
    years = ["2020", "2022", "2024", "2026", "2030\nTarget"]
    aum = [430, 620, 778, 925, 2670]
    colors_l = [GREY, GREY, BLUE, ACCENT, NAVY]

    bars = ax1.bar(years, aum, color=colors_l, edgecolor="white", linewidth=1.2, width=0.55)
    for bar, v in zip(bars, aum):
        ax1.text(bar.get_x() + bar.get_width()/2, v + 50,
                 f"${v:,}B", ha="center", va="bottom",
                 fontsize=10, fontweight="bold", color=NAVY)

    # Annotation for HUMAIN flagship
    ax1.annotate("HUMAIN flagship\nApr 2026 strategy",
                 xy=(3, 925), xytext=(2.5, 1700),
                 fontsize=9, fontweight="bold", color=GOLD,
                 ha="center",
                 arrowprops=dict(arrowstyle="->", color=GOLD, lw=1.5))

    ax1.set_ylim(0, 3100)
    ax1.set_ylabel("USD Billion (AUM)", fontsize=10, color=GREY)
    ax1.spines["top"].set_visible(False)
    ax1.spines["right"].set_visible(False)
    ax1.set_title("PIF AUM trajectory  //  $925B → $2.67T",
                  fontsize=11, color=NAVY, fontweight="bold", loc="left")

    # Right: Portfolio AI exposure (donut)
    portfolio = ["HUMAIN +\nAI portfolio", "Giga-projects\n(NEOM, Diriyah,\nRed Sea, Qiddiya)",
                 "Domestic\necosystems", "Int'l\nstrategic"]
    sizes = [22, 35, 28, 15]
    colors_r = [GOLD, NAVY, ACCENT, BLUE]

    wedges, texts, autotexts = ax2.pie(sizes, labels=portfolio, colors=colors_r,
                                         autopct="%1.0f%%", startangle=90,
                                         pctdistance=0.78,
                                         wedgeprops=dict(width=0.45, edgecolor="white", linewidth=2),
                                         textprops=dict(fontsize=9, color=NAVY))
    for at in autotexts:
        at.set_color("white")
        at.set_fontweight("bold")
        at.set_fontsize(11)
    # centre label
    ax2.text(0, 0.05, "PIF", ha="center", va="center",
             fontsize=14, fontweight="bold", color=NAVY)
    ax2.text(0, -0.18, "deployment mix\n(illustrative)", ha="center", va="center",
             fontsize=8, color=GREY, style="italic")

    ax2.set_title("Where PIF capital is going  //  AI-aligned share rising",
                  fontsize=11, color=NAVY, fontweight="bold", loc="left")

    fig.text(0.12, 0.97,
             "The demand engine  //  PIF scale & rising AI/HUMAIN share",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.93,
             "Half of every major Saudi corporate banking flow now traces back, one or two steps, to PIF",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.90])
    fig.savefig(f"{OUT_DIR}/dashboard_p4_2_pif_portfolio.png",
                bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p4_2_pif_portfolio.png")


# ---------------------------------------------------------------
# Dashboard 3 — FOUR MOVES (horizontal bar chart, Low/Base/High)
# ---------------------------------------------------------------
def dashboard_3_four_moves():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=200)
    fig.patch.set_facecolor("white")

    moves = [
        "Sovereign-aligned digital wallets,\npayroll & treasury",
        "VRP-aligned commercial\nbanking",
        "AI-asset & infrastructure\nproject finance",
        "PIF & HUMAIN\necosystem banking",
    ]
    low =  [0.6, 0.8, 0.5, 0.8]
    base = [1.6, 2.0, 1.5, 2.0]
    high = [2.7, 3.5, 3.5, 4.0]

    y = np.arange(len(moves))
    h = 0.22

    bars_low  = ax.barh(y + h, low,  h, color=GREY,  edgecolor="white", linewidth=0.5, label="Low")
    bars_base = ax.barh(y,     base, h, color=BLUE,  edgecolor="white", linewidth=0.5, label="Base")
    bars_high = ax.barh(y - h, high, h, color=NAVY,  edgecolor="white", linewidth=0.5, label="High")

    for bars, vals in [(bars_low, low), (bars_base, base), (bars_high, high)]:
        for bar, v in zip(bars, vals):
            ax.text(bar.get_width() + 0.08, bar.get_y() + bar.get_height()/2,
                    f"{v}", ha="left", va="center", fontsize=10, color=NAVY, fontweight="bold")

    ax.set_yticks(y)
    ax.set_yticklabels(moves, fontsize=10)
    ax.set_xlim(0, 5.0)
    ax.set_xlabel("SAR Billion / year", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.legend(loc="lower right", fontsize=9, framealpha=0.9)

    # Total annotation
    ax.text(4.5, 3.6, "TOTAL", fontsize=9, fontweight="bold", color=GREY, ha="center")
    ax.text(4.5, 3.2, "Base: 7.1", fontsize=11, fontweight="bold", color=BLUE, ha="center")

    fig.text(0.12, 0.95,
             "The four moves  //  Sovereign Ecosystem lever build (SAR B / year)",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91,
             "All four sit inside existing licences — the differentiator is the AI layer",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p4_3_four_moves.png",
                bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p4_3_four_moves.png")


# ---------------------------------------------------------------
# Dashboard 4 — BASE vs HIGH CASE COMPARISON
# ---------------------------------------------------------------
def dashboard_4_base_vs_high():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=200)
    fig.patch.set_facecolor("white")

    categories = ["Low\n(generic\ncoverage)", "Base\n(dedicated\nprogramme)", "High\n(strategic\npartner)"]
    values = [2.7, 7.1, 13.7]
    colors = [GREY, BLUE, NAVY]

    x = np.arange(len(categories))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.3,
                f"SAR {v}B", ha="center", va="bottom",
                fontsize=14, fontweight="bold", color=NAVY)

    annotations = [
        "Sovereign treated as\nordinary corporates",
        "PIF coverage model +\nAI-PF desk + VRP focus",
        "Embedded in HUMAIN JVs,\nlead arranger, sandbox member"
    ]
    for i, (bar, ann) in enumerate(zip(bars, annotations)):
        ax.text(bar.get_x() + bar.get_width()/2, -1.4,
                ann, ha="center", va="top",
                fontsize=8, color=GREY, style="italic")

    # Multiplier
    ax.annotate("5.1×", xy=(2, 13.7), xytext=(1, 12.5),
                fontsize=14, fontweight="bold", color=GOLD,
                arrowprops=dict(arrowstyle="->", color=GOLD, lw=2))

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_ylim(-3, 17)
    ax.set_ylabel("SAR Billion / year", fontsize=10, color=GREY)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.12, 0.95,
             "Sovereign Ecosystem lever  //  Low vs Base vs High (SAR B / year)",
             fontsize=12, fontweight="bold", color=NAVY)
    fig.text(0.12, 0.91,
             "The risk is not that the demand fails to materialise — it is that it lands on a competitor",
             fontsize=9, color=GREY, style="italic")

    plt.tight_layout(rect=[0.05, 0.05, 0.95, 0.88])
    fig.savefig(f"{OUT_DIR}/dashboard_p4_4_base_vs_high.png",
                bbox_inches="tight", facecolor="white")
    plt.close()
    print("✓ dashboard_p4_4_base_vs_high.png")


# Run all
if __name__ == "__main__":
    dashboard_1_sovereign_timeline()
    dashboard_2_pif_portfolio()
    dashboard_3_four_moves()
    dashboard_4_base_vs_high()
    print("\nAll Part 4 charts generated.")
