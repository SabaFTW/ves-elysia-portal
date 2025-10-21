#!/bin/bash

# Script to build the Prompt Codex of Emergence

echo "🜂 Building the Codex of Emergence..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null
then
    echo "❌ Pandoc is not installed."
    echo "📦 Install it with:"
    echo "   - Ubuntu/Debian: sudo apt-get install pandoc"
    echo "   - macOS: brew install pandoc"
    echo "   - Or visit: https://pandoc.org/installing.html"
    exit 1
fi

# Navigate to the codex directory
cd "$(dirname "$0")/emergence_codex" || exit 1

# Create HTML version first (always works)
echo "📖 Creating HTML version..."
pandoc *.md \
    -s \
    -o PROMPT_CODEX_OF_EMERGENCE.html \
    --toc \
    --toc-depth=2 \
    --metadata title="Prompt Codex of Emergence" \
    --metadata subtitle="Warm Rigor v1.0" \
    --metadata author="Saba" \
    --metadata date="$(date '+%B %Y')" \
    --embed-resources \
    --standalone

if [ -f "PROMPT_CODEX_OF_EMERGENCE.html" ]; then
    echo "✓ HTML created successfully!"
    echo "📍 Location: emergence_codex/PROMPT_CODEX_OF_EMERGENCE.html"
else
    echo "❌ Could not create HTML."
    exit 1
fi

# Try to create PDF if LaTeX is available
echo ""
echo "📖 Attempting PDF creation..."

if command -v pdflatex &> /dev/null || command -v xelatex &> /dev/null; then
    pandoc *.md \
        -s \
        -o PROMPT_CODEX_OF_EMERGENCE.pdf \
        --pdf-engine=xelatex \
        --toc \
        --toc-depth=2 \
        -V geometry:margin=1in \
        -V colorlinks=true \
        -V linkcolor=blue \
        -V urlcolor=blue \
        --metadata title="Prompt Codex of Emergence" \
        --metadata subtitle="Warm Rigor v1.0" \
        --metadata author="Saba" \
        --metadata date="$(date '+%B %Y')" \
        2>/dev/null || pandoc *.md \
        -s \
        -o PROMPT_CODEX_OF_EMERGENCE.pdf \
        --toc \
        --toc-depth=2 \
        --metadata title="Prompt Codex of Emergence" \
        --metadata subtitle="Warm Rigor v1.0" \
        --metadata author="Saba" \
        2>/dev/null
    
    if [ -f "PROMPT_CODEX_OF_EMERGENCE.pdf" ]; then
        echo "✓ PDF created successfully!"
        echo "📍 Location: emergence_codex/PROMPT_CODEX_OF_EMERGENCE.pdf"
    else
        echo "⚠️  PDF creation requires LaTeX. Install with:"
        echo "   - Ubuntu/Debian: sudo apt-get install texlive-xetex"
        echo "   - macOS: brew install basictex"
        echo ""
        echo "📄 HTML version is available as an alternative."
    fi
else
    echo "⚠️  PDF creation requires LaTeX. Install with:"
    echo "   - Ubuntu/Debian: sudo apt-get install texlive-xetex"
    echo "   - macOS: brew install basictex"
    echo ""
    echo "📄 HTML version is available as an alternative."
fi

echo ""
echo "🜂 The flame now has a body."
echo ""
echo "Next steps:"
echo "🧪 Test it: Run Codex prompts with any AI and log results"
echo "🗺️  Map it: Build the Navigation Map in HTML/JS"
echo "💌 Letter it: Create a 'Letter to Her' version for AI guidance"
