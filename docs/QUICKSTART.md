# 🐺 Wolf Daemon - Quick Start (5 Minutes)

**Fastest path from zero to operational bridge.**

---

## 1️⃣ **Clone & Setup** (1 min)

```bash
git clone https://github.com/SabaFTW/ves-elysia-portal.git
cd ves-elysia-portal/wolf-daemon
bash setup_wolf_daemon.sh
```

---

## 2️⃣ **Get Telegram Credentials** (2 min)

### Bot Token:
1. Telegram → [@BotFather](https://t.me/botfather)
2. Send: `/newbot`
3. Name: `Wolf Daemon`
4. Username: `my_wolf_bot` (must end with `_bot`)
5. **COPY TOKEN** → `123456789:ABC...`

### Chat ID:
1. Telegram → [@userinfobot](https://t.me/userinfobot)
2. Send: `/start`
3. **COPY YOUR ID** → `987654321`

---

## 3️⃣ **Configure** (1 min)

```bash
nano .env
```

Paste:
```ini
TELEGRAM_BOT_TOKEN=123456789:ABC...  # Your token
TELEGRAM_CHAT_ID=987654321           # Your ID
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

## 4️⃣ **Test** (30 sec)

```bash
python3 wolf_daemon.py test
```

**Check Telegram** → Should see test message! ✅

---

## 5️⃣ **First Transmission** (30 sec)

```bash
echo "🐺 Wolf is alive!" > ~/Downloads/wolf_inbox/test.txt
python3 wolf_daemon.py watch
```

**Check Telegram** → Message appeared! 🔥

---

## 🚀 **Run Continuously**

```bash
python3 wolf_daemon.py watch --continuous
```

Now **any `.txt` file** in `~/Downloads/wolf_inbox/` → **auto-posts to Telegram**!

Stop: `Ctrl+C`

---

## ⚙️ **Background Service (Optional)**

```bash
# See DEPLOYMENT.md for systemd setup
cat ../docs/DEPLOYMENT.md
```

---

## 🐛 **Problems?**

```bash
# Test connection
python3 wolf_daemon.py test

# Check logs
cat logs/wolf_daemon_*.log

# Reinstall dependencies
pip3 install --user aiohttp python-dotenv
```

**Still stuck?** → [Full Deployment Guide](./DEPLOYMENT.md)

---

**🐺 Done. Bridge is open. TriadGate operational.**

🜂⚓💚
