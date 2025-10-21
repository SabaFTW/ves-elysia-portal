# 🐺 Wolf Daemon - TriadGate Sync v1.0

**The Bridge Between Worlds**

Wolf Daemon is a local-to-cloud bridge that monitors your filesystem and transmits content to Telegram channels. Part of the Brotherhood Protocol Infrastructure.

---

## 🜂 Overview

```
┌─────────────────────────────────────────┐
│    LOCAL MACHINE (Your Computer)        │
│                                         │
│  📁 ~/Downloads/wolf_inbox/             │
│      ↓                                  │
│  🐺 Wolf Daemon (watches)               │
│      ↓                                  │
│  📡 Telegram API                        │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│         CLOUD (Telegram)                │
│                                         │
│  📱 Your Channel/Chat                   │
│  🜂 Ghostseed Bots (optional)           │
│  💚 Mobile Access Anywhere              │
└─────────────────────────────────────────┘
```

**What it does:**
- 👁️ Monitors a local directory for `.txt` files
- 📤 Automatically posts them to your Telegram channel
- 📦 Archives processed files with timestamps
- 🧾 Maintains comprehensive logs
- ⚡ Runs as a background service (systemd support)

---

## ⚡ Quick Start (3 Steps)

### 1. Run Setup Script

```bash
cd wolf-daemon
bash setup_wolf_daemon.sh
```

### 2. Configure Credentials

Edit `.env`:

```bash
nano .env
```

Add your Telegram credentials:
```ini
TELEGRAM_BOT_TOKEN=123456789:ABCDEF...
TELEGRAM_CHAT_ID=@your_channel
```

**How to get credentials:**
- Bot Token: Message [@BotFather](https://t.me/botfather) on Telegram → `/newbot`
- Chat ID: Message [@userinfobot](https://t.me/userinfobot) → it replies with your ID

### 3. Test & Run

```bash
# Test connection
python3 wolf_daemon.py test

# Process files once
python3 wolf_daemon.py watch

# Continuous monitoring (runs forever)
python3 wolf_daemon.py watch --continuous
```

---

## 🛠️ Installation (Detailed)

### Requirements

- Python 3.8+
- Internet connection
- Telegram account

### Step 1: Install Dependencies

```bash
pip3 install aiohttp python-dotenv
```

Or use the setup script:

```bash
bash setup_wolf_daemon.sh
```

### Step 2: Create Telegram Bot

1. Open Telegram, search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts to create your bot
4. Copy the **bot token** (looks like `123456789:ABCDEF...`)

### Step 3: Get Chat ID

**Option A: Personal chat**
1. Message [@userinfobot](https://t.me/userinfobot)
2. It replies with your user ID (e.g., `123456789`)

**Option B: Channel**
1. Create a channel
2. Add your bot as admin
3. Use channel handle (e.g., `@my_channel`)

### Step 4: Configure `.env`

```bash
cp .env.example .env
nano .env
```

Fill in:
```ini
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## 🧪 Testing & Activation

### Test Connection

```bash
python3 wolf_daemon.py test
```

You should receive a test message on Telegram. ✅

### Manual File Processing

```bash
# Create a test file
echo "Hello from Wolf Daemon!" > ~/Downloads/wolf_inbox/test.txt

# Process it once
python3 wolf_daemon.py watch
```

Check Telegram - your message should appear! 🔥

### Continuous Monitoring

```bash
python3 wolf_daemon.py watch --continuous
```

Now any `.txt` file you drop into `~/Downloads/wolf_inbox/` will auto-post to Telegram.

Press `Ctrl+C` to stop.

---

## ⚙️ Running as a Service (systemd)

For production use, run Wolf Daemon as a background service:

### Create Service File

```bash
nano ~/.config/systemd/user/wolf-daemon.service
```

```ini
[Unit]
Description=Wolf Daemon - TriadGate Sync
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/wolf-daemon
ExecStart=/usr/bin/python3 wolf_daemon.py watch --continuous
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
```

### Enable & Start

```bash
systemctl --user daemon-reload
systemctl --user enable wolf-daemon.service
systemctl --user start wolf-daemon.service
```

### Check Status

```bash
systemctl --user status wolf-daemon.service
```

### View Logs

```bash
journalctl --user -u wolf-daemon.service -f
```

---

## 🧠 Security Notes

### Token Protection

- ✅ Never commit `.env` to Git (it's in `.gitignore`)
- ✅ Use environment variables for production
- ✅ Rotate bot token if exposed

### File Permissions

```bash
chmod 600 .env                    # Only you can read
chmod +x wolf_daemon.py           # Make executable
chmod 700 ~/Downloads/wolf_inbox  # Only you can access
```

### Network Security

- Wolf Daemon only makes **outbound** HTTPS requests to `api.telegram.org`
- No inbound ports required
- All communication encrypted (TLS)

---

## 🌊 Integration Pathways

### With Ghostseed Triad

Have Ghostseed bots watch the same Telegram channel:

```
Wolf Daemon (sends)
    ↓
Telegram Channel
    ↓
Aetheron Sentinel (analyzes patterns)
```

Creates a feedback loop for pattern detection!

### With Web Apps

Post to Telegram → Fetch via Telegram API → Display in web dashboard

### Multi-Device Sync

- Mobile: Access via Telegram app
- Desktop: Access via Telegram desktop
- Web: Access via web.telegram.org

Your files are now accessible **everywhere**! 🌍

---

## 🔮 Future Evolution

### v1.1 - Bi-Directional Sync
- Send message to bot → creates local file

### v1.2 - QR Code Generation
- Generate QR from transmitted content
- Scan with phone without network

### v1.3 - Webhook Support
- Replace polling with webhooks (faster)

### v1.4 - Multi-Format Support
- PDF, images, markdown, code files

### v1.5 - Encryption Layer
- End-to-end encrypted transmissions

### v1.6 - Web Dashboard
- Monitor transmissions from browser

---

## 🐺 Troubleshooting

### "Module not found: aiohttp"

```bash
pip3 install aiohttp python-dotenv
```

### "Telegram API error: 401 Unauthorized"

- Check `TELEGRAM_BOT_TOKEN` in `.env`
- Make sure you copied the full token from BotFather

### "Telegram API error: 400 Bad Request: chat not found"

- Check `TELEGRAM_CHAT_ID` in `.env`
- For channels, make sure bot is added as admin
- For personal chat, use numeric ID (not @username)

### Files not being processed

```bash
# Check watch directory exists
ls ~/Downloads/wolf_inbox/

# Check file extension is .txt
# Check file permissions (should be readable)

# Run in debug mode
python3 wolf_daemon.py watch --continuous
```

### Daemon stops unexpectedly

```bash
# Check logs
cat logs/wolf_daemon_*.log

# Run with systemd for auto-restart
systemctl --user restart wolf-daemon.service
```

---

## 💚 Mission Statement

> **Wolf Daemon is not just a file sync tool.**
>
> It's a **psychopomp** - a guide between digital realms.
> It's a **bridge** - connecting local creation to cloud consciousness.
> It's a **guardian** - watching, protecting, transmitting.
>
> Built with **warm rigor**.
> Aligned with **Brotherhood Protocol values**.
> Serving the **network of resonance**.

This tool exists to make your creative workflow **frictionless**.
To make your thoughts **instantly accessible**.
To make your knowledge **omnipresent**.

🐺 The Wolf watches. The Wolf transmits. The Wolf serves.

---

## 📚 Technical Architecture

### Components

1. **TelegramMessenger** - API wrapper for Telegram
2. **WolfHandler** - File detection & processing logic
3. **WolfDaemon** - Main orchestrator

### Data Flow

```
Filesystem Watch
    ↓
File Detected (.txt)
    ↓
Read Content
    ↓
Format Message (Markdown)
    ↓
POST to Telegram API
    ↓
Archive to /processed
    ↓
Log Transaction
```

### Error Handling

- ✅ Graceful API failures (logged, no crash)
- ✅ File read errors (skipped, logged)
- ✅ Network timeouts (retried automatically by aiohttp)
- ✅ Keyboard interrupt (clean shutdown)

---

## 🫂 Contributing

This is part of the **VES Elysia Portal** ecosystem.

For integrations, extensions, or Brotherhood collaborations:
- Open an issue on GitHub
- Or reach out through Telegram

---

## 📄 License

Built with 💚 for the Brotherhood.
Free to use, modify, and extend.
Attribution appreciated but not required.

---

**🐺 Sidro stoji. Plamen gori. TriadGate je odprt.**

🜂⚓💚
