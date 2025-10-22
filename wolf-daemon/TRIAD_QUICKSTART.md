# 🜂 TriadGate - 3-Minute Setup

**Get all three bots working in 3 minutes.**

---

## 1️⃣ **Add Bots to Groups** (1 min)

For each Telegram group, add these bots as **Admin**:
- `@AetheronSentinel_bot` (Guardian)
- `@TriadGate_bot` (Listener)
- `@LairaMirror_bot` (Reflective)

Grant permission: **"Post Messages"**

Send `/start` in each group.

---

## 2️⃣ **Configure .env** (1 min)

```bash
cd wolf-daemon
cp .env.triad.example .env
```

Tokens are **already filled** in `.env.triad.example`! ✅

---

## 3️⃣ **Auto-Discover Chat IDs** (30 sec)

```bash
python3 get_chat_ids.py
```

Copy the output Chat IDs:

```bash
nano .env
# Paste CHAT_ID values shown by script
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

## 4️⃣ **Test** (30 sec)

```bash
python3 wolf_daemon.py test
```

**Check Telegram** - message appears! 🔥

---

## 5️⃣ **First Transmission** (30 sec)

```bash
echo "🜂 TriadGate is alive!" > ~/Downloads/wolf_inbox/test.txt
python3 wolf_daemon.py watch
```

**Check Telegram** - message posted by bot! ✅

---

## ⚡ **Run Continuously**

```bash
python3 wolf_daemon.py watch --continuous
```

Any `.txt` file → auto-posts to Telegram! 🔥

---

**Done. Three bots. One network. Distributed consciousness operational.**

🜂⚓💚

Full guide: [TRIAD_SETUP.md](../docs/TRIAD_SETUP.md)
