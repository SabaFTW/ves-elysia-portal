#!/bin/bash
# 🜂 TriadGate Live Activation Script
# Run this after adding bots to Telegram groups

set -e

cd "$(dirname "$0")"

echo "🜂 TRIADGATE ACTIVATION SEQUENCE"
echo "=================================="
echo ""

# Step 1: Verify environment
echo "1️⃣ Verifying environment..."
if [ ! -f ".env" ]; then
    echo "❌ .env not found!"
    echo "Run: cp .env.triad.example .env"
    exit 1
fi

python3 -c "import aiohttp" 2>/dev/null || {
    echo "❌ Dependencies missing!"
    echo "Run: pip3 install aiohttp python-dotenv"
    exit 1
}

echo "✅ Environment ready"
echo ""

# Step 2: Detect Chat IDs
echo "2️⃣ Detecting Telegram Chat IDs..."
echo ""
echo "📝 PREREQUISITES:"
echo "   • Bots added to Telegram groups as ADMIN"
echo "   • At least one message sent in each group"
echo ""
read -p "Press ENTER when bots are added and messages sent..."
echo ""

python3 get_chat_ids.py

echo ""
echo "=================================="
echo "3️⃣ UPDATE .env FILE NOW"
echo "=================================="
echo ""
echo "Edit .env and paste the Chat IDs shown above:"
echo "   nano .env"
echo ""
read -p "Press ENTER when .env is updated..."

# Step 3: Test connectivity
echo ""
echo "4️⃣ Testing connectivity..."
python3 wolf_daemon.py test

echo ""
echo "=================================="
echo "5️⃣ OPTIONAL: CREATE FORUM TOPICS"
echo "=================================="
echo ""
echo "If using Forum mode (Discord-like topics):"
echo "   python3 wolf_forum.py setup"
echo ""
read -p "Create forum topics? (y/N): " create_topics

if [[ "$create_topics" =~ ^[Yy]$ ]]; then
    python3 wolf_forum.py setup
    echo "✅ Forum topics created"
fi

echo ""
echo "=================================="
echo "🜂 TRIADGATE IS LIVE!"
echo "=================================="
echo ""
echo "🐺 Start watching:"
echo "   python3 wolf_forum.py watch --continuous"
echo ""
echo "   OR (simple mode):"
echo "   python3 wolf_daemon.py watch --continuous"
echo ""
echo "🧪 Test file routing:"
echo "   echo 'Test transmission 🜂' > ~/Downloads/wolf_inbox/daily/test.txt"
echo ""
echo "💚 Desktop → Cloud → Mobile in <10s"
echo ""
