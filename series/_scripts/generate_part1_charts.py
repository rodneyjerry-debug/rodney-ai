"""
Generate 3 dashboard PNGs for Part 1 of The Vision 2030 Bank Scoreboard.
All charts use the CV/LinkedIn brand palette.
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

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["font.size"]   = 10
plt.rcParams["axes.edgecolor"]  = GREY
plt.rcParams["axes.labelcolor"] = NAVY
plt.rcParams["xtick.color"]     = GREY
plt.rcParams["ytick.color"]     = GREY
plt.rcParams["text.color"]      = NAVY

OUT_DIR = "/sessions/cool-amazing-ptolemy/charts"
os.makedirs(OUT_DIR, exist_ok=True)

# ---------------------------------------------------------------
# Dashboard 1 — THE HEADLINE SCORECARD
# Market cap scenarios: current → Low / Base / High 2030
# ---------------------------------------------------------------
def dashboard_1_scorecard():
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=200)
    fig.patch.set_facecolor("white")

    labels = ["Today\n(2024)", "2030\nLow", "2030\nBase", "2030\nHigh"]
    values = [208, 420, 503, 600]  # USD B
    colors = [GREY, BLUE, ACCENT, NAVY]

    x = np.arange(len(labels))
    bars = ax.bar(x, values, width=0.55, color=colors, edgecolor="white", linewidth=1.2)

    # Value labels on top
    for i, (bar, v) in enumerate(zip(bars, values)):
        ax.text(bar.get_x() + bar.get_width()/2, v + 12,
                f"${v}B", ha="center", va="bottom",
                fontsize=14, fontweight="bold", color=NAVY)

    # Incremental annotations for 2030 bars
    deltas = [None, 212, 295, 392]
    for i, d in enumerate(deltas):
        if d is None:
            continue
        ax.annotate(f"+${d}B\nunlock",
                    xy=(i, values[i]/2), ha="center", va="center",
                    fontsize=10, fontweight="bold", color="white")

    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=11, color=NAVY)
    ax.set_ylim(0, 720)
    ax.set_yticks([])
    ax.set_ylabel("")
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(GREY)
    ax.spines["bottom"].set_linewidth(0.8)

    ax.set_title("Saudi Banks  //  Market Cap Scorecard (USD Billion)",
                 fontsize=13, fontweight="bold", color=NAVY,
                 loc="left", pad=18)
    ax.text(0, 1.02, "The prize: $295B of market cap unlock by 2030 in the Base case",
            transform=ax.transAxes, fontsize=10, style="italic", color=GREY)

    ax.text(3, -90, "Source: Sector equity × P/B with 2030 re-rating. See model for methodology.",
            ha="right", va="top", fontsize=8, style="italic", color=GREY)

    plt.tight_layout()
    plt.savefig(f"{OUT_DIR}/dashboard_1_scorecard.png",
                bbox_inches="tight", facecolor="white", dpi=200)
    plt.close()
    print("Dashboard 1 saved: scorecard")

# ---------------------------------------------------------------
# Dashboard 2 — THE FOUR LEVERS CONTRIBUTION (Base case waterfall)
# ---------------------------------------------------------------
def dashboard_2_levers():
    fig, ax = plt.subplots(figsize=(10, 4.8), dpi=200)
    fig.patch.set_facecolor("white")

    labels = [
        "L1\nMonetization",
        "L2\nTokenization\n(direct)",
        "L3\nCapital\nEfficiency",
        "L4\nSovereign\nEcosystem",
        "Less:\nL1/L4\noverlap",
        "TOTAL",
    ]
    values = [29.5, 2.7, 2.5, 7.1, -1.1, 40.8]
    cumulative = [0, 29.5, 32.2, 34.7, 41.8, 0]
    colors = [BLUE, ACCENT, ACCENT, BLUE, GREY, NAVY]

    x = np.arange(len(labels))
    bar_width = 0.55

    for i, (xv, v, base) in enumerate(zip(x, values, cumulative)):
        if i == len(values) - 1:
            # TOTAL bar starts at 0
            ax.bar(xv, v, bottom=0, width=bar_width, color=colors[i],
                   edgecolor="white", linewidth=1)
        else:
            if v >= 0:
                ax.bar(xv, v, bottom=base, width=bar_width, color=colors[i],
                       edgecolor="white", linewidth=1)
            else:
                # Negative stays at top of prior
                ax.bar(xv, v, bottom=base, width=bar_width, color=colors[i],
                       edgecolor="white", linewidth=1)

    # Connector lines between bars (waterfall style)
    connector_y = cumulative[1:5] + [cumulative[4] + values[4]]
    for i in range(len(values) - 1):
        if i < 4:
            y = cumulative[i] + values[i]
            ax.plot([i + bar_width/2, i + 1 - bar_width/2], [y, y],
                    color=GREY, linewidth=0.8, linestyle=":")
        elif i == 4:
            y = cumulative[i] + values[i]
            ax.plot([i + bar_width/2, i + 1 - bar_width/2], [y, y],
                    color=GREY, linewidth=0.8, linestyle=":")

    # Value labels
    for i, (xv, v, base) in enumerate(zip(x, values, cumulative)):
        label = f"+{v:.1f}" if v > 0 and i < 5 else (f"{v:.1f}" if v < 0 else f"{v:.1f}")
        if i == len(values) - 1:
            y = v + 1.2
            ax.text(xv, y, f"{v:.1f}", ha="center", va="bottom",
                    fontsize=13, fontweight="bold", color=NAVY)
        elif v >= 0:
            y = base + v + 0.8
            ax.text(xv, y, label, ha="center", va="bottom",
                    fontsize=10, fontweight="bold", color=NAVY)
        else:
            y = base + v - 0.8
            ax.text(xv, y, label, ha="center", va="top",
                    fontsize=10, fontweight="bold", color=GREY)

    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9.5, color=NAVY)
    ax.set_ylim(-2, 48)
    ax.set_yticks([])
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(GREY)
    ax.spines["bottom"].set_linewidth(0.8)

    ax.set_title("The Four Levers  //  Annual income uplift by 2030 (SAR Billion, Base case)",
                 fontsize=13, fontweight="bold", color=NAVY,
                 loc="left", pad=18)
    ax.text(0, 1.02, "SAR 40.8 B/yr of new income  //  25% ROE  //  $295B market cap unlock",
            transform=ax.transAxes, fontsize=10, style="italic", color=GREY)

    plt.tight_layout()
    plt.savefig(f"{OUT_DIR}/dashboard_2_levers.png",
                bbox_inches="tight", facecolor="white", dpi=200)
    plt.close()
    print("Dashboard 2 saved: levers waterfall")

# ---------------------------------------------------------------
# Dashboard 3 — THE OPPORTUNITY GAP (global benchmarks)
# Non-interest income share: Saudi vs GCC vs Asia vs US vs Wealth endgame
# ---------------------------------------------------------------
def dashboard_3_underpricing():
    fig, ax = plt.subplots(figsize=(11, 5.2), dpi=200)
    fig.patch.set_facecolor("white")

    # Sorted ascending so the gap reads left-to-right
    segs = [
        ("Saudi banks today",                 25, GREY),
        ("Saudi banks 2030 target (Base)",    38, BLUE),
        ("DBS Singapore (Asia peer)",         40, ACCENT),
        ("GCC peer (ENBD / FAB)",             45, ACCENT),
        ("JPMorgan Chase (US global)",        48, NAVY),
        ("UBS (wealth endgame)",              75, GOLD),
    ]
    names = [s[0] for s in segs]
    vals  = [s[1] for s in segs]
    cols  = [s[2] for s in segs]

    y = np.arange(len(segs))[::-1]
    bars = ax.barh(y, vals, color=cols, height=0.55, edgecolor="white", linewidth=1)

    for bi, (bar, v) in enumerate(zip(bars, vals)):
        ax.text(v + 1.2, bar.get_y() + bar.get_height()/2,
                f"{v}%", va="center", fontsize=13, fontweight="bold", color=NAVY)

    ax.set_yticks(y)
    ax.set_yticklabels(names, fontsize=11, color=NAVY)
    ax.set_xlim(0, 88)
    ax.set_xticks([])
    for spine in ["top", "right", "bottom"]:
        ax.spines[spine].set_visible(False)
    ax.spines["left"].set_color(GREY)
    ax.spines["left"].set_linewidth(0.8)

    # Reference line at Saudi today (25%)
    ax.axvline(x=25, color=GREY, linewidth=0.8, linestyle=":", alpha=0.7)
    ax.text(25, -0.85, "Saudi today", fontsize=8, color=GREY, ha="center", style="italic")

    ax.set_title("Non-interest income share  //  Saudi vs the world",
                 fontsize=13, fontweight="bold", color=NAVY,
                 loc="left", pad=18)
    ax.text(0, 1.03,
            "The opportunity: 13 points to Base, 20 to GCC peer, 23 to global, 50 to the wealth endgame",
            transform=ax.transAxes, fontsize=10, style="italic", color=GREY)

    ax.text(88, -1.3,
            "Source: Company filings 2024 FY; A&M KSA / UAE Banking Pulse Q3 2024",
            ha="right", va="top", fontsize=8, style="italic", color=GREY)

    plt.tight_layout()
    plt.savefig(f"{OUT_DIR}/dashboard_3_underpricing.png",
                bbox_inches="tight", facecolor="white", dpi=200)
    plt.close()
    print("Dashboard 3 saved: global opportunity gap")


# ---------------------------------------------------------------
# Dashboard 4 — THE MONETIZATION BUILD (the four sub-levers)
# ---------------------------------------------------------------
def dashboard_4_build():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=200)
    fig.patch.set_facecolor("white")

    sublevers = [
        ("BaaS /\nEmbedded Finance", 8.0),
        ("Data\nProducts",           5.0),
        ("Open\nBanking APIs",       5.0),
        ("Intelligence-\nas-a-Service", 6.0),
    ]
    names = [s[0] for s in sublevers]
    vals  = [s[1] for s in sublevers]

    x = np.arange(len(sublevers))
    bars = ax.bar(x, vals, color=[BLUE, ACCENT, BLUE, ACCENT],
                  width=0.55, edgecolor="white", linewidth=1)
    for bar, v in zip(bars, vals):
        ax.text(bar.get_x() + bar.get_width()/2, v + 0.25,
                f"{v:.0f}", ha="center", va="bottom",
                fontsize=14, fontweight="bold", color=NAVY)

    # Sub-lever total reference line
    ax.axhline(y=24, xmin=0.03, xmax=0.97, color=GOLD, linewidth=1.2, linestyle="--")
    ax.text(1.5, 25.2, "SAR 24 B  //  sub-lever total (Base)",
            ha="center", fontsize=10, fontweight="bold", color=GOLD, style="italic")

    ax.set_xticks(x)
    ax.set_xticklabels(names, fontsize=10, color=NAVY)
    ax.set_ylim(0, 29)
    ax.set_yticks([])
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color(GREY)
    ax.spines["bottom"].set_linewidth(0.8)

    ax.set_title("The monetization build  //  four fee pools on the table (SAR B / yr, Base)",
                 fontsize=12.5, fontweight="bold", color=NAVY,
                 loc="left", pad=18)
    ax.text(0, 1.03,
            "Cross-check of the top-down gap: bottom-up build reconciles to SAR 24–30 B / yr",
            transform=ax.transAxes, fontsize=10, style="italic", color=GREY)

    plt.tight_layout()
    plt.savefig(f"{OUT_DIR}/dashboard_4_build.png",
                bbox_inches="tight", facecolor="white", dpi=200)
    plt.close()
    print("Dashboard 4 saved: monetization build")

# ---------------------------------------------------------------
if __name__ == "__main__":
    dashboard_1_scorecard()
    dashboard_2_levers()
    dashboard_3_underpricing()
    dashboard_4_build()
    print("\nAll dashboards generated in", OUT_DIR)
