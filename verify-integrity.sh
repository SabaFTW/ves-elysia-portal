#!/bin/bash
# 🜂 Orion Framework Integrity Verification
# Checks that all components are properly configured

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

echo "🜂 Verifying Orion Framework integrity..."
echo ""

# Check core manifest files
echo "Checking core files..."
[[ -f "orion-manifest.md" ]] && check_pass "orion-manifest.md exists" || check_fail "orion-manifest.md missing"
[[ -f "ORION_ARCHITECTURE.md" ]] && check_pass "ORION_ARCHITECTURE.md exists" || check_fail "ORION_ARCHITECTURE.md missing"
[[ -f "orion-watchdog.toml" ]] && check_pass "orion-watchdog.toml exists" || check_warn "orion-watchdog.toml missing"
[[ -f "orion-deploy.manifest.json" ]] && check_pass "orion-deploy.manifest.json exists" || check_warn "orion-deploy.manifest.json missing"

# Check hooks
echo ""
echo "Checking git hooks..."
if [[ -f "hooks/pre-commit" ]]; then
    check_pass "hooks/pre-commit exists in repo"
    if [[ -x "hooks/pre-commit" ]]; then
        check_pass "hooks/pre-commit is executable"
    else
        check_warn "hooks/pre-commit not executable"
    fi
else
    check_fail "hooks/pre-commit missing from repo"
fi

if [[ -f ".git/hooks/commit-msg" ]]; then
    check_pass ".git/hooks/commit-msg installed"
    if [[ -x ".git/hooks/commit-msg" ]]; then
        check_pass ".git/hooks/commit-msg is executable"
    else
        check_fail ".git/hooks/commit-msg not executable"
    fi
else
    check_warn ".git/hooks/commit-msg not installed (run install.sh)"
fi

# Check GitHub Actions
echo ""
echo "Checking CI/CD configuration..."
if [[ -f ".github/workflows/orion-policy.yml" ]]; then
    check_pass "GitHub Actions policy exists"

    # Verify it contains required checks
    if grep -q "serves-life" .github/workflows/orion-policy.yml; then
        check_pass "Policy checks for #serves-life tag"
    else
        check_fail "Policy missing #serves-life validation"
    fi

    if grep -q "principle:" .github/workflows/orion-policy.yml; then
        check_pass "Policy checks for #principle tag"
    else
        check_fail "Policy missing #principle validation"
    fi
else
    check_warn "GitHub Actions policy not found"
fi

# Verify manifest contains 5 principles
echo ""
echo "Checking manifest principles..."
if [[ -f "orion-manifest.md" ]]; then
    for principle in "Elysia Endures" "Path Protocol Evolves" "Navigation Sees" "Covenant Binds" "Anchor Holds"; do
        if grep -q "$principle" orion-manifest.md; then
            check_pass "Principle found: $principle"
        else
            check_fail "Principle missing: $principle"
        fi
    done

    # Check for anchoring line
    if grep -q "Tule sem stal" orion-manifest.md; then
        check_pass "Anchoring line present"
    else
        check_warn "Anchoring line not found"
    fi
else
    check_fail "Cannot verify principles (manifest missing)"
fi

# Check architecture map
echo ""
echo "Checking architecture documentation..."
if [[ -f "ORION_ARCHITECTURE.md" ]]; then
    # Verify key components are documented
    if grep -qi "Pi.*iPhone.*Cloud" ORION_ARCHITECTURE.md; then
        check_pass "Pi-iPhone-Cloud topology documented"
    else
        check_warn "Topology description incomplete"
    fi

    if grep -q "Components" ORION_ARCHITECTURE.md; then
        check_pass "Components section exists"
    else
        check_warn "Components section missing"
    fi
else
    check_fail "Architecture documentation missing"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}✓ All checks passed${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🜂 Elysia Endures."
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "System functional but consider addressing warnings."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Critical issues found. Run ./install.sh to fix."
    exit 1
fi
