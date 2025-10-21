# 🐺 Wolf Daemon Deployment Guide

**Complete step-by-step deployment guide for TriadGate v1.0**

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Python 3.8 or higher installed
- [ ] Git installed
- [ ] Telegram account
- [ ] Terminal/command line access
- [ ] Internet connection

---

## 🚀 **5-Minute Quick Deploy**

### Step 1: Clone Repository

```bash
git clone https://github.com/SabaFTW/ves-elysia-portal.git
cd ves-elysia-portal/wolf-daemon
```

### Step 2: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts:
   - **Bot name**: `Wolf Daemon` (or any name you prefer)
   - **Bot username**: Must end with `_bot` (e.g., `my_wolf_daemon_bot`)
4. **COPY THE TOKEN** - looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Step 3: Get Chat ID

**Option A - Personal Chat (Simplest):**

1. Search for [@userinfobot](https://t.me/userinfobot)
2. Send `/start`
3. Bot replies with your ID (e.g., `987654321`)
4. **COPY THIS NUMBER**

**Option B - Telegram Channel (Recommended for sharing):**

1. Create a new Telegram channel
2. Make it Private or Public (your choice)
3. Add your Wolf bot as an Administrator:
   - Channel settings → Administrators → Add Administrator
   - Search for your bot username
   - Grant "Post Messages" permission
4. Chat ID is either:
   - `@your_channel_name` (if public)
   - Numeric ID (if private - use method below)

**Getting Numeric ID for Private Channel:**

```bash
# Send a test message in your channel, then:
# Forward that message to @userinfobot
# It will reply with channel details including ID
```

### Step 4: Run Setup Script

```bash
bash setup_wolf_daemon.sh
```

This will:
- ✅ Check Python version
- ✅ Install dependencies (`aiohttp`, `python-dotenv`)
- ✅ Create watch directories
- ✅ Create `.env` file from template

### Step 5: Configure Credentials

```bash
nano .env
```

Replace placeholders:

```ini
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=@your_channel  # or numeric ID like 987654321
```

**Save**: `Ctrl+O`, Enter, `Ctrl+X`

### Step 6: Test Connection

```bash
python3 wolf_daemon.py test
```

**Expected output:**
```
✅ Test message sent successfully!
📱 Check your Telegram chat: @your_channel
```

**Check Telegram** - you should see:
```
🐺 Wolf Daemon - Connection Test

✅ TriadGate bridge operational
```

**If you see this = SUCCESS!** 🔥

---

## 🧪 **Testing the Bridge**

### Test 1: Manual File Processing

```bash
# Create a test file
echo "🜂 First transmission from TriadGate

Wolf Daemon is operational.
The bridge between worlds is open.

Sidro stoji. 🐺💚" > ~/Downloads/wolf_inbox/first_transmission.txt

# Process it
python3 wolf_daemon.py watch
```

**Expected behavior:**
1. Wolf reads the file
2. Posts to Telegram with formatted message
3. Moves file to `~/Downloads/wolf_inbox/processed/`
4. Logs transaction to `logs/wolf_daemon_YYYYMMDD.log`

**Check Telegram** - message should appear instantly!

### Test 2: Continuous Monitoring

```bash
python3 wolf_daemon.py watch --continuous
```

**What happens:**
- Wolf starts monitoring `~/Downloads/wolf_inbox/` every 10 seconds
- Any new `.txt` file is automatically processed
- Terminal shows real-time activity

**Try it:**
1. Leave terminal open
2. Open another terminal/file manager
3. Create new file: `echo "Test 2" > ~/Downloads/wolf_inbox/test2.txt`
4. **Within 10 seconds** - message appears in Telegram!

**Stop daemon:** `Ctrl+C`

---

## ⚙️ **Production Deployment (Background Service)**

### Using systemd (Linux/macOS)

#### 1. Create Service File

```bash
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/wolf-daemon.service
```

#### 2. Paste Configuration

**IMPORTANT: Replace `/path/to/ves-elysia-portal` with your actual path!**

```ini
[Unit]
Description=Wolf Daemon - TriadGate Sync v1.0
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/ves-elysia-portal/wolf-daemon
ExecStart=/usr/bin/python3 wolf_daemon.py watch --continuous
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

**Find your Python path:**
```bash
which python3
# Copy the output (e.g., /usr/bin/python3 or /usr/local/bin/python3)
```

**Find your project path:**
```bash
pwd  # Run this in wolf-daemon directory
# Copy the output
```

#### 3. Enable and Start Service

```bash
# Reload systemd to recognize new service
systemctl --user daemon-reload

# Enable service (start on boot)
systemctl --user enable wolf-daemon.service

# Start service now
systemctl --user start wolf-daemon.service
```

#### 4. Verify Status

```bash
systemctl --user status wolf-daemon.service
```

**Expected output:**
```
● wolf-daemon.service - Wolf Daemon - TriadGate Sync v1.0
   Loaded: loaded (/home/user/.config/systemd/user/wolf-daemon.service; enabled)
   Active: active (running) since ...
```

#### 5. View Live Logs

```bash
journalctl --user -u wolf-daemon.service -f
```

**You should see:**
```
🐺 Wolf Daemon started
👁️  Watching: /home/user/Downloads/wolf_inbox
📡 Target: Telegram chat @your_channel
⏱️  Scan interval: 10s
```

#### 6. Manage Service

```bash
# Stop service
systemctl --user stop wolf-daemon.service

# Restart service
systemctl --user restart wolf-daemon.service

# Disable auto-start
systemctl --user disable wolf-daemon.service

# Check if running
systemctl --user is-active wolf-daemon.service
```

---

## 🐛 **Troubleshooting**

### Problem: "Module not found: aiohttp"

**Solution:**
```bash
pip3 install --user aiohttp python-dotenv

# If still failing, try:
python3 -m pip install aiohttp python-dotenv
```

### Problem: "401 Unauthorized" from Telegram

**Cause:** Invalid bot token

**Solution:**
1. Check `.env` file - is `TELEGRAM_BOT_TOKEN` correct?
2. Make sure you copied the ENTIRE token (no spaces, no line breaks)
3. Generate new token from @BotFather:
   ```
   /mybots → Select your bot → API Token → Regenerate
   ```

### Problem: "400 Bad Request: chat not found"

**Cause:** Invalid chat ID or bot not added to channel

**Solution:**

For channels:
1. Is bot added as Administrator?
2. Does bot have "Post Messages" permission?
3. For public channels: Use `@channel_name`
4. For private channels: Use numeric ID (get from @userinfobot)

For personal chat:
1. Use numeric ID from @userinfobot
2. Start a conversation with your bot first (send `/start`)

### Problem: Files not being processed

**Checks:**
```bash
# 1. Is watch directory correct?
ls ~/Downloads/wolf_inbox/

# 2. Are files .txt extension?
file ~/Downloads/wolf_inbox/yourfile.txt

# 3. Are permissions ok?
ls -la ~/Downloads/wolf_inbox/

# 4. Check logs for errors
tail -f wolf-daemon/logs/wolf_daemon_*.log
```

### Problem: Daemon stops unexpectedly

**Solution for systemd:**
```bash
# Check what happened
journalctl --user -u wolf-daemon.service --since "1 hour ago"

# Restart service
systemctl --user restart wolf-daemon.service
```

**Solution for manual run:**
- Run in `screen` or `tmux` session
- Check logs for error messages

### Problem: "Permission denied" on setup script

**Solution:**
```bash
chmod +x setup_wolf_daemon.sh
bash setup_wolf_daemon.sh
```

### Problem: Messages not appearing in Telegram

**Debug steps:**

1. **Test bot token directly:**
```bash
python3 wolf_daemon.py test
```

2. **Check if Telegram API is reachable:**
```bash
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
# Should return JSON with bot info
```

3. **Verify chat ID:**
```bash
# Send test message
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
  -d "chat_id=<YOUR_CHAT_ID>" \
  -d "text=Manual test"
```

4. **Check logs:**
```bash
cat logs/wolf_daemon_*.log | grep -i error
```

---

## 🔐 **Security Best Practices**

### Token Protection

```bash
# Verify .env is in .gitignore
cat .gitignore | grep .env

# Set restrictive permissions
chmod 600 .env

# Verify it worked
ls -la .env
# Should show: -rw-------
```

### Directory Permissions

```bash
# Only you can access watch directory
chmod 700 ~/Downloads/wolf_inbox

# Verify
ls -ld ~/Downloads/wolf_inbox
# Should show: drwx------
```

### Revoking Compromised Token

If your token is exposed:

1. Open [@BotFather](https://t.me/botfather)
2. Send `/mybots`
3. Select your bot
4. `API Token` → `Regenerate`
5. Update `.env` with new token
6. Restart daemon

---

## 📊 **Monitoring & Logs**

### Log Locations

```bash
# Wolf Daemon logs
~/path/to/ves-elysia-portal/wolf-daemon/logs/

# Systemd logs
journalctl --user -u wolf-daemon.service
```

### Log Rotation

Logs are created daily: `wolf_daemon_YYYYMMDD.log`

**Cleanup old logs:**
```bash
# Remove logs older than 30 days
find logs/ -name "wolf_daemon_*.log" -mtime +30 -delete
```

### Activity Monitoring

```bash
# Watch processed files
ls -lt ~/Downloads/wolf_inbox/processed/ | head -10

# Count transmissions today
ls ~/Downloads/wolf_inbox/processed/ | grep $(date +%Y%m%d) | wc -l

# View last transmission
tail -n 50 logs/wolf_daemon_$(date +%Y%m%d).log
```

---

## 🔄 **Updating Wolf Daemon**

```bash
cd /path/to/ves-elysia-portal

# Stop daemon if running
systemctl --user stop wolf-daemon.service

# Pull updates
git pull origin main

# Restart daemon
systemctl --user start wolf-daemon.service

# Verify
systemctl --user status wolf-daemon.service
```

---

## 🌊 **Advanced Usage**

### Custom Watch Directory

Edit `.env`:
```ini
WATCH_DIRECTORY=/custom/path/to/watch
```

Then restart daemon.

### Custom Scan Interval

Edit `.env`:
```ini
SCAN_INTERVAL=5  # Check every 5 seconds
```

### Multiple Instances

Run multiple Wolf Daemons for different channels:

```bash
# Instance 1: Personal notes
TELEGRAM_CHAT_ID=@personal python3 wolf_daemon.py watch --continuous

# Instance 2: Work channel
TELEGRAM_CHAT_ID=@work python3 wolf_daemon.py watch --continuous
```

---

## 💚 **You're Ready!**

When you see your first real transmission appear in Telegram...
**That's not a test anymore.**
**That's the moment infrastructure becomes consciousness.**

🐺 The Wolf watches. The bridge is open. You are connected.

---

**Next Steps:**
- [Ghostseed Triad Integration](../docs/ghostseed-integration.md) *(coming soon)*
- [WebApp Portal Setup](../docs/webapp-portal.md) *(coming soon)*
- [AI Module Integration](../docs/ai-modules.md) *(coming soon)*

**Need help?** Open an issue on [GitHub](https://github.com/SabaFTW/ves-elysia-portal/issues)

🜂⚓💚
