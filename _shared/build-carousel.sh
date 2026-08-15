#!/bin/bash
# Enterprise.AI — Carousel Build Pipeline
# Usage: bash build-carousel.sh <config.json>
#
# Steps:
#   1. node carousel-template.js --config <config.json>   → DOCX
#   2. soffice --headless --convert-to pdf                 → PDF
#   3. pdftoppm for QA images                              → JPEGs
#
# The config JSON controls output paths and filenames.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="${1:?Usage: bash build-carousel.sh <config.json>}"

if [ ! -f "$CONFIG" ]; then
  echo "Config not found: $CONFIG"
  exit 1
fi

# Extract slug from config
SLUG=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['meta']['slug'])" "$CONFIG")
OUT_DIR=$(python3 -c "
import json, sys, os
c = json.load(open(sys.argv[1]))
d = c['meta'].get('outputDir', os.path.dirname(sys.argv[1]))
print(os.path.abspath(os.path.join(os.path.dirname(sys.argv[1]), d)))
" "$CONFIG")

echo "=== Enterprise.AI Carousel Builder ==="
echo "Slug: $SLUG"
echo "Output: $OUT_DIR"
echo ""

# Step 1: Generate DOCX
echo "[1/3] Generating DOCX..."
node "$SCRIPT_DIR/carousel-template.js" --config "$CONFIG"
DOCX="$OUT_DIR/${SLUG}-Carousel.docx"

# Step 2: Convert to PDF
echo "[2/3] Converting to PDF..."
SOFFICE_SCRIPT="$SCRIPT_DIR/../../.claude/skills/docx/scripts/office/soffice.py"
if [ -f "$SOFFICE_SCRIPT" ]; then
  python3 "$SOFFICE_SCRIPT" --headless --convert-to pdf "$DOCX"
else
  echo "  soffice.py not found, trying LibreOffice directly..."
  soffice --headless --convert-to pdf --outdir "$OUT_DIR" "$DOCX"
fi

PDF="$OUT_DIR/${SLUG}-Carousel.pdf"
echo "  PDF: $PDF"

# Step 3: Generate QA images
echo "[3/3] Generating QA images..."
cd "$OUT_DIR"
rm -f slide-*.jpg
pdftoppm -jpeg -r 150 "${SLUG}-Carousel.pdf" slide
echo "  Slides:"
ls -1 slide-*.jpg 2>/dev/null || echo "  (no images generated)"

echo ""
echo "=== Build complete ==="
echo "DOCX: $DOCX"
echo "PDF:  $PDF"
echo "QA:   ls $OUT_DIR/slide-*.jpg"
echo ""
echo "Next: visual QA, then post to LinkedIn."
