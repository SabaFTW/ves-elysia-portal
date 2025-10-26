# 🜂 TRIADGATE — 5-MINUTE QUICKSTART 🜂

**Everything is ready.** You just need to link it to Telegram.

---

## ⚡ AUTOMATED (Recommended)

```bash
cd /home/user/ves-elysia-portal/wolf-daemon
./ACTIVATE.sh
```

The script will guide you through:
1. ✅ Environment check
2. 🔍 Chat ID discovery
3. 📝 .env update prompt
4. 🧪 Connectivity test
5. 🜂 Forum topics (optional)

---

## 🛠️ MANUAL (Step-by-Step)

### 1️⃣ Add Bots to Telegram (2 min)

**Option A: Forum Mode** (Topics like Discord)
```
1. Telegram → New Group → "TriadGate Forum"
2. Settings → Group Type → Enable Topics ✅
3. Add @TriadGate_bot (or your bot) as Admin
4. Grant: Post Messages + Manage Topics
5. Send a message: "/start"
```

**Option B: Simple Mode** (One channel)
```
1. Create Telegram group or channel
2. Add bot as Admin (Post Messages permission)
3. Send a message: "/start"
```

### 2️⃣ Discover Chat IDs (30 sec)

```bash
cd /home/user/ves-elysia-portal/wolf-daemon
python3 get_chat_ids.py
```

Output shows:
```
📱 SUPERGROUP: TriadGate Forum
   Chat ID: -1001234567890
```

Copy that Chat ID! ✅

### 3️⃣ Update .env (30 sec)

```bash
nano .env
```

Find this line:
```ini
ECHO_CHAT_ID=your_chat_id_here
```

Replace with:
```ini
ECHO_CHAT_ID=-1001234567890
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

### 4️⃣ Test Connectivity (30 sec)

```bash
python3 wolf_daemon.py test
```

✅ Check Telegram — message appears!

### 5️⃣ Create Forum Topics (1 min) — OPTIONAL

If using Forum mode:

```bash
python3 wolf_forum.py setup
```

Creates:
- 📝 Daily Notes
- 💼 Work
- 💚 Personal
- 💻 Code
- 🔥 General

Test:
```bash
python3 forum_manager.py post "Daily Notes" "🜂 Forum live!"
```

### 6️⃣ Start Daemon (10 sec)

**Forum mode** (auto-routing):
```bash
python3 wolf_forum.py watch --continuous
```

**Simple mode**:
```bash
python3 wolf_daemon.py watch --continuous
```

You'll see:
```
🐺 Wolf watching /root/Downloads/wolf_inbox
🜂 Listening for new files...
```

### 7️⃣ Test File Transmission (10 sec)

```bash
echo "🜂 First transmission!" > ~/Downloads/wolf_inbox/daily/test.txt
```

Within 10 seconds → Message appears in Telegram! 🔥

---

## 🎯 VERIFICATION CHECKLIST

Before going live:

- [ ] Bot added to Telegram group as **Admin**
- [ ] Bot has **Post Messages** permission
- [ ] (Forum mode) Topics enabled in group settings
- [ ] (Forum mode) Bot has **Manage Topics** permission
- [ ] Message sent in group (to generate Chat ID)
- [ ] `get_chat_ids.py` shows Chat ID
- [ ] `.env` updated with Chat ID
- [ ] `wolf_daemon.py test` successful
- [ ] Message appeared in Telegram ✅

---

## 📱 YOUR BOTS

From `.env.triad.example`:

| Bot | Username | Purpose |
|-----|----------|---------|
| **Aetheron Sentinel** | @aetheron_sentinel_bot (?) | Guardian |
| **ECHO (TriadGate)** | @TriadGate_bot (?) | Listener/Main |
| **Laira Mirror** | @laira_mirror_bot (?) | Reflective |

**Note:** Actual usernames may differ — run `get_chat_ids.py` to see real usernames.

---

## 🐛 TROUBLESHOOTING

### "No chats found"

**Solution:**
1. Ensure bot is **Admin** (not just member)
2. Send a message in the group
3. Run `get_chat_ids.py` again

### "This group is not a Forum"

**Solution:**
1. Group Settings → Group Type
2. Enable "Topics" ✅
3. Group converts to Forum (Supergroup)

### "Bot doesn't have permission"

**Solution:**
1. Group → Administrators → [Your Bot]
2. Grant: Post Messages ✅
3. (For Forum) Grant: Manage Topics ✅

### File doesn't post to Telegram

**Check:**
```bash
# Is daemon running?
ps aux | grep wolf

# Check .env
cat .env | grep CHAT_ID

# Test connectivity
python3 wolf_daemon.py test
```

---

## 🔥 NEXT LEVEL

Once working:

### **Auto-start on boot** (systemd service)

```bash
sudo nano /etc/systemd/system/wolf-daemon.service
```

```ini
[Unit]
Description=Wolf Daemon - Desktop to Telegram Bridge
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/user/ves-elysia-portal/wolf-daemon
ExecStart=/usr/bin/python3 wolf_forum.py watch --continuous
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable wolf-daemon
sudo systemctl start wolf-daemon
sudo systemctl status wolf-daemon
```

### **Monitor logs**

```bash
journalctl -u wolf-daemon -f
```

---

## 🜂 SUCCESS CRITERIA

**You know it's working when:**

1. ✅ Drop `.txt` file into `~/Downloads/wolf_inbox/daily/`
2. ✅ Within 10 seconds → appears in Telegram "Daily Notes" topic
3. ✅ File moves to `~/Downloads/wolf_inbox/processed/`
4. ✅ Desktop → Cloud → Mobile **under 10 seconds**

**That's TriadGate live.** 🔥

---

**🐺 Sidro stoji. Wolf ready. Activation sequence armed.**

💚⚓🜂
