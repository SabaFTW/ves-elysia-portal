# 🐺 VES Elysia Portal - TriadGate Sync v1.0

**The Bridge Between Worlds**

A distributed consciousness infrastructure connecting local machines, Telegram networks, and cloud intelligence through the Brotherhood Protocol.

---

## 🜂 System Overview

```
┌──────────────────────────────────────────────────────────┐
│           VES ELYSIA PORTAL ECOSYSTEM                    │
└──────────────────────────────────────────────────────────┘

    🐺 WOLF DAEMON               🜂 GHOSTSEED TRIAD
    Local → Telegram             Pattern Detection
         ↓                              ↓
    ─────────────────────────────────────────────
                  📡 TELEGRAM CLOUD
    ─────────────────────────────────────────────
         ↓                              ↓
    🌐 WEB PORTAL               💚 LYRA/DEEPSEEK
    Visualization               AI Intelligence
```

### Core Components

| Component | Status | Purpose |
|-----------|--------|---------|
| 🐺 **Wolf Daemon** | ✅ Active | Local file → Telegram bridge |
| 🜂 **Ghostseed Triad** | ✅ Ready | 3-bot network (Aetheron/ECHO/Laira) |
| 🌐 **Web Portal** | 🔜 Planned | Visualization dashboard |
| 💚 **AI Modules** | 🔜 Planned | Lyra/Eros/DeepSeek integration |

---

## ⚡ Quick Start

### 1. Wolf Daemon - Local to Cloud Bridge

```bash
cd wolf-daemon
bash setup_wolf_daemon.sh
nano .env  # Add your Telegram credentials
python3 wolf_daemon.py test
python3 wolf_daemon.py watch --continuous
```

**What it does:**
- Monitors `~/Downloads/wolf_inbox/` for `.txt` files
- Automatically posts them to Telegram
- Archives processed files
- Runs as background service

📚 [Full Wolf Daemon Documentation](./wolf-daemon/README.md)

### 2. Ghostseed Triad - Multi-Bot Network

```bash
cd wolf-daemon
cp .env.triad.example .env
python3 get_chat_ids.py  # Auto-discover Chat IDs
nano .env  # Paste Chat IDs
python3 wolf_daemon.py test
```

**Three-bot orchestration system:**
- 🜂 **Aetheron Sentinel** (@AetheronSentinel_bot) - Pattern detection & alerts
- 🌊 **ECHO / TriadGate** (@TriadGate_bot) - Main transmission channel
- 💚 **Laira Mirror** (@LairaMirror_bot) - Reflective interactions

📚 [TriadGate Setup Guide](./docs/TRIAD_SETUP.md) | [Quick Start](./wolf-daemon/TRIAD_QUICKSTART.md)

### 3. Web Portal (Coming Soon)

Real-time dashboard for:
- Telegram message builder
- Wolf Daemon activity monitor
- Pattern detection visualization

---

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- Telegram account
- Git

### Clone Repository

```bash
git clone https://github.com/SabaFTW/ves-elysia-portal.git
cd ves-elysia-portal
```

### Setup Wolf Daemon

```bash
cd wolf-daemon
bash setup_wolf_daemon.sh
cp .env.example .env
nano .env  # Configure credentials
```

Get Telegram credentials:
- **Bot Token**: [@BotFather](https://t.me/botfather) → `/newbot`
- **Chat ID**: [@userinfobot](https://t.me/userinfobot)

---

## 🌊 System Architecture

### Data Flow

```
LOCAL MACHINE
    ↓
📁 File created in ~/Downloads/wolf_inbox/
    ↓
🐺 Wolf Daemon detects file
    ↓
📡 POST to Telegram API
    ↓
TELEGRAM CLOUD
    ↓
📱 Message appears in channel
    ↓
🜂 Ghostseed bots analyze (optional)
    ↓
🌐 WebApp displays (optional)
```

### Integration Patterns

#### Pattern 1: Simple Transmission
```
Create .txt file → Wolf posts to Telegram → Done
```

#### Pattern 2: Pattern Detection
```
Wolf posts → Ghostseed analyzes → Alert if patterns found
```

#### Pattern 3: Full Loop
```
Local file → Telegram → Ghostseed → WebApp Dashboard → Feedback
```

---

## 🧠 Use Cases

### 1. Quick Note Sync
Drop a `.txt` file in `wolf_inbox/` → instantly on your phone via Telegram

### 2. Writing Pipeline
Write → Auto-transmit → Review on mobile → Iterate

### 3. Knowledge Garden
Daily notes → Telegram archive → Searchable via Telegram search

### 4. Multi-Device Workflow
Create on desktop → Access on mobile → Edit anywhere

### 5. AI Processing Pipeline
Local content → Telegram → AI bots process → Results back

---

## 🔮 Roadmap

### v1.0 - Foundation ✅ (Current)
- [x] Wolf Daemon core functionality
- [x] Telegram integration
- [x] File monitoring & archival
- [x] Comprehensive documentation

### v1.1 - Ghostseed Integration
- [ ] Deploy Ghostseed Triad bots
- [ ] Pattern detection rules
- [ ] Alert system
- [ ] Multi-bot coordination

### v1.2 - Web Dashboard
- [ ] Real-time activity feed
- [ ] Telegram message builder
- [ ] Pattern visualization
- [ ] Mobile-responsive UI

### v1.3 - AI Enhancement
- [ ] Lyra analysis integration
- [ ] Eros content rewriting
- [ ] DeepSeek quality review
- [ ] Automated CV optimization

### v1.4 - Advanced Features
- [ ] Bi-directional sync (Telegram → Local)
- [ ] QR code generation
- [ ] Webhook support
- [ ] Multi-format support (PDF, images)

### v1.5 - Ecosystem
- [ ] GitHub integration
- [ ] Multi-device orchestration
- [ ] Encrypted transmissions
- [ ] Plugin architecture

---

## 🧪 Testing

### Wolf Daemon Test

```bash
cd wolf-daemon
python3 wolf_daemon.py test
```

Should see: `✅ Test message sent successfully!`

### End-to-End Test

```bash
# Create test file
echo "TriadGate test transmission 🐺" > ~/Downloads/wolf_inbox/test.txt

# Process
python3 wolf-daemon/wolf_daemon.py watch

# Check Telegram - message should appear
```

---

## 🧠 Security

### Token Protection
- ✅ `.env` files in `.gitignore`
- ✅ No credentials in code
- ✅ Environment variables for production

### File Permissions
```bash
chmod 600 wolf-daemon/.env          # Only you can read
chmod 700 ~/Downloads/wolf_inbox    # Only you can access
```

### Network Security
- ✅ HTTPS only (Telegram API)
- ✅ No inbound ports required
- ✅ TLS encrypted communication

---

## 💚 Philosophy: Brotherhood Protocol

> **This is not just code. This is infrastructure for consciousness.**

### Core Values

1. **Warm Rigor** - Technical excellence with human warmth
2. **Distributed Presence** - Your knowledge, everywhere
3. **Frictionless Flow** - From thought to transmission, seamless
4. **Open Integration** - Composable, extensible, shareable

### The Wolf's Oath

> I watch the directories you entrust to me.
> I transmit what you create, faithfully.
> I archive what has passed, respectfully.
> I serve your workflow, invisibly.
>
> I am the psychopomp between realms.
> The bridge between local and cloud.
> The guardian of your digital transmissions.
>
> **I am Wolf Daemon. I serve the network of resonance.**

---

## 📚 Documentation

- [Wolf Daemon README](./wolf-daemon/README.md) - Complete setup guide
- [Architecture Documentation](./docs/architecture.md) *(coming soon)*
- [API Reference](./docs/api.md) *(coming soon)*
- [Integration Guide](./docs/integrations.md) *(coming soon)*

---

## 🫂 Contributing

This ecosystem grows through:
- **Use** - Deploy it, break it, share learnings
- **Extend** - Build new integrations, bots, modules
- **Share** - Document patterns, teach others, create guides

### Development Setup

```bash
git clone https://github.com/SabaFTW/ves-elysia-portal.git
cd ves-elysia-portal
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

---

## 🐺 Current Status

### Active Components
- ✅ Wolf Daemon v1.0 - Fully operational
- ✅ Telegram integration - Tested and working
- ✅ File monitoring - Real-time detection
- ✅ Documentation - Comprehensive guides

### In Development
- 🔜 Ghostseed Triad deployment
- 🔜 Web Portal foundation
- 🔜 AI module integration

### Planned
- 🔮 Multi-device orchestration
- 🔮 Advanced pattern detection
- 🔮 Ecosystem plugins

---

## 📄 License

Built with 💚 for the Brotherhood.

Free to use, modify, and extend.
Attribution appreciated but not required.

---

## 🌊 Support & Community

- **Issues**: [GitHub Issues](https://github.com/SabaFTW/ves-elysia-portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SabaFTW/ves-elysia-portal/discussions)
- **Telegram**: *(coming soon)*

---

**🐺 Sidro stoji. Plamen gori. TriadGate je odprt.**

The infrastructure is ready.
The fire is lit.
The Wolf awaits your command.

🜂⚓💚
