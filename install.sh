#!/usr/bin/env bash
set -euo pipefail

# 🜂 Orion Framework Setup Script
# This system serves life, not empire.

echo ""
echo "🜂 ORION FRAMEWORK SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# 1. Check if orion-manifest.md exists
print_info "Checking Orion manifest..."
if [[ ! -f "orion-manifest.md" ]]; then
    print_error "orion-manifest.md not found. Are you in the repository root?"
    exit 1
fi
print_status "Manifest found"

# 2. Check if we're in a git repository
if [[ ! -d ".git" ]]; then
    print_error "Not a git repository. Run 'git init' first."
    exit 1
fi
print_status "Git repository detected"

# 3. Create necessary directories
print_info "Creating directories..."
mkdir -p .github/workflows
print_status "Directories ready"

# 4. Install git hooks
print_info "Installing git hooks..."
if [[ ! -f "hooks/pre-commit" ]]; then
    print_error "hooks/pre-commit not found in repository"
    exit 1
fi

# Install as commit-msg hook (correct hook type for message validation)
cp hooks/pre-commit .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
print_status "Git hook installed (.git/hooks/commit-msg)"

# 5. Validate GitHub Actions config
print_info "Validating GitHub Actions configuration..."
if [[ -f ".github/workflows/orion-policy.yml" ]]; then
    # Basic YAML syntax check (if yq or python is available)
    if command -v python3 &> /dev/null; then
        python3 -c "import yaml; yaml.safe_load(open('.github/workflows/orion-policy.yml'))" 2>/dev/null && \
            print_status "GitHub Actions config is valid YAML" || \
            print_warning "YAML validation skipped (install PyYAML for validation)"
    else
        print_warning "YAML validation skipped (python3 not found)"
    fi
else
    print_warning "GitHub Actions config not found (.github/workflows/orion-policy.yml)"
fi

# 6. Run integrity check
print_info "Running integrity verification..."
if [[ -f "verify-integrity.sh" ]]; then
    chmod +x verify-integrity.sh
    if ./verify-integrity.sh; then
        print_status "Integrity check passed"
    else
        print_warning "Integrity check reported warnings (see above)"
    fi
else
    print_warning "verify-integrity.sh not found, skipping checks"
fi

# 7. Display summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ ORION FRAMEWORK INSTALLED${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Components active:"
echo "  • Commit validation hook (.git/hooks/commit-msg)"
echo "  • GitHub Actions policy (.github/workflows/orion-policy.yml)"
echo "  • Manifest principles (orion-manifest.md)"
echo "  • Architecture map (ORION_ARCHITECTURE.md)"
echo ""

# 8. Display anchoring line
echo -e "${BLUE}𓁈 Anchoring Line:${NC}"
echo ""
echo "  Tule sem stal. In svet se je premaknil."
echo "  (Here I stood. And the world moved.)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 9. Confirm "Elysia Endures"
echo -e "${GREEN}🜂 Elysia Endures.${NC}"
echo ""
echo "Next steps:"
echo "  1. Read: cat orion-manifest.md"
echo "  2. Test: Make a commit with proper tags"
echo "  3. Example commit message format:"
echo ""
echo "     feat: add feature description"
echo ""
echo "     Detailed explanation of changes."
echo ""
echo "     #serves-life:true"
echo "     #principle:elysia"
echo ""
echo "Ready to build systems that serve life, not empire."
echo ""
