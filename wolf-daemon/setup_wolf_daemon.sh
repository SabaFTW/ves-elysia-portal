#!/bin/bash
# 🐺 Wolf Daemon Setup Script
# TriadGate Sync v1.0 Installation

set -e

echo "🐺 Wolf Daemon - Setup Starting..."
echo "=================================="

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python version: $PYTHON_VERSION"

# Install Python dependencies
echo ""
echo "📦 Installing dependencies..."
pip3 install --user aiohttp python-dotenv

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p ~/Downloads/wolf_inbox
mkdir -p ~/Downloads/wolf_inbox/processed
mkdir -p logs

echo "✅ Created:"
echo "   - ~/Downloads/wolf_inbox (watch directory)"
echo "   - ~/Downloads/wolf_inbox/processed (archive)"
echo "   - ./logs (log files)"

# Check .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found"
    if [ -f .env.example ]; then
        echo "📋 Creating .env from .env.example"
        cp .env.example .env
        echo "⚠️  Please edit .env with your Telegram credentials:"
        echo "   - TELEGRAM_BOT_TOKEN (from @BotFather)"
        echo "   - TELEGRAM_CHAT_ID (from @userinfobot)"
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Make wolf_daemon.py executable
chmod +x wolf_daemon.py

# Test installation
echo ""
echo "🧪 Testing installation..."
if python3 -c "import aiohttp, dotenv" 2>/dev/null; then
    echo "✅ All dependencies installed correctly"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

echo ""
echo "=================================="
echo "✅ Wolf Daemon setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Telegram credentials"
echo "2. Run test: python3 wolf_daemon.py test"
echo "3. Start daemon: python3 wolf_daemon.py watch --continuous"
echo ""
echo "🐺 Ready to transmit. TriadGate awaits."
