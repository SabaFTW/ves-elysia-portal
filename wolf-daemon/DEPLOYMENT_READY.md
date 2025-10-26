# 🜂 TRIADGATE DEPLOYMENT - READY TO ACTIVATE 🜂

**Status:** Environment prepared ✅
**Time to Launch:** 5 minutes
**Difficulty:** EASY

---

## 🎯 WHAT'S READY

✅ **Dependencies installed**: `aiohttp`, `python-dotenv`
✅ **Environment configured**: `.env` created with bot tokens
✅ **Directory structure**: `~/Downloads/wolf_inbox/` with topic subfolders
✅ **Three bots configured**:
   - Aetheron Sentinel (Guardian)
   - ECHO/TriadGate (Listener)
   - Laira Mirror (Reflective)

---

## 📝 WHAT YOU NEED TO DO

### **Option 1: Quick Launch (Forum + TriadGate)** ⚡

**Step 1:** Create Telegram Forum Group (2 min)

```
1. Telegram → New Group → "TriadGate Forum"
2. Group Settings → Group Type → Enable Topics ✅
3. Add @TriadGate_bot as Admin
4. Grant permissions: Post Messages + Manage Topics
```

**Step 2:** Get Chat ID (30 sec)

```bash
python3 get_chat_ids.py
# Copy the Chat ID (e.g., -1001234567890)
```

**Step 3:** Update .env (30 sec)

```bash
nano .env
# Update this line:
ECHO_CHAT_ID=-1001234567890  # Use your actual Chat ID
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

**Step 4:** Create Forum Topics (30 sec)

```bash
python3 wolf_forum.py setup
```

This creates:
- 📝 Daily Notes
- 💼 Work
- 💚 Personal
- 💻 Code
- 🔥 General

**Step 5:** Test! (30 sec)

```bash
# Test 1: Send to specific topic
python3 forum_manager.py post "Daily Notes" "🜂 TriadGate Forum is alive!"

# Test 2: Auto-routing test
echo "Test daily note 🐺" > ~/Downloads/wolf_inbox/daily/test.txt
python3 wolf_forum.py watch
```

**Check Telegram** - messages appear in correct topics! ✅

---

### **Option 2: Simple Launch (Basic Wolf Daemon)** 🐺

**Step 1:** Create Telegram Group or Channel (1 min)

```
1. Create new Telegram group/channel
2. Add @TriadGate_bot as Admin
3. Grant permission: Post Messages
```

**Step 2:** Get Chat ID (30 sec)

```bash
python3 get_chat_ids.py
```

**Step 3:** Update .env (30 sec)

```bash
nano .env
# Update:
ECHO_CHAT_ID=-1001234567890
```

**Step 4:** Test (30 sec)

```bash
# Test transmission
python3 wolf_daemon.py test

# Watch mode
echo "🐺 First transmission!" > ~/Downloads/wolf_inbox/test.txt
python3 wolf_daemon.py watch
```

**Check Telegram** - message posted! ✅

---

## 🔥 CONTINUOUS MODE

Once tested, run continuously:

### **Forum Mode** (with topic routing)

```bash
python3 wolf_forum.py watch --continuous
```

Any file → auto-routes to correct topic:
- `daily-note.txt` → Daily Notes
- `work-task.txt` → Work
- File in `wolf_inbox/code/` → Code topic

### **Simple Mode** (all to one chat)

```bash
python3 wolf_daemon.py watch --continuous
```

Any `.txt` file → posts to Telegram

---

## 🜂 TRIAD ACTIVATION (All 3 Bots)

If you want all three bots active:

**Step 1:** Create 3 Telegram groups/channels

1. Group for Aetheron Sentinel
2. Group for ECHO/TriadGate
3. Group for Laira Mirror

**Step 2:** Get all Chat IDs

```bash
python3 get_chat_ids.py
```

**Step 3:** Update .env with all Chat IDs

```bash
nano .env
```

```ini
AETHERON_CHAT_ID=-1001111111111
ECHO_CHAT_ID=-1002222222222
LAIRA_CHAT_ID=-1003333333333
```

**Step 4:** Test each bot

```bash
# Test Aetheron
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'Aetheron: {os.getenv(\"AETHERON_CHAT_ID\")}')"

# Test ECHO
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'ECHO: {os.getenv(\"ECHO_CHAT_ID\")}')"

# Test Laira
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print(f'Laira: {os.getenv(\"LAIRA_CHAT_ID\")}')"
```

**Step 5:** Run TriadSync (if you have the script)

```bash
python3 run_triadsync.py
```

---

## 📂 FILE ROUTING PATTERNS

### **Method 1: Filename Keywords**

```
daily-reflection.txt    → Daily Notes topic
work-project-notes.txt  → Work topic
personal-idea.txt       → Personal topic
code-snippet.py         → Code topic
anything-else.txt       → General topic
```

### **Method 2: Folder Structure**

```
~/Downloads/wolf_inbox/daily/note.txt     → Daily Notes
~/Downloads/wolf_inbox/work/task.txt      → Work
~/Downloads/wolf_inbox/personal/idea.txt  → Personal
~/Downloads/wolf_inbox/code/script.py     → Code
```

**You can use BOTH methods!** The system checks folder first, then filename.

---

## 🧪 VERIFICATION CHECKLIST

Before full deployment, verify:

- [ ] Dependencies installed (`pip3 list | grep aiohttp`)
- [ ] `.env` exists with at least one `CHAT_ID` configured
- [ ] `~/Downloads/wolf_inbox/` directory exists
- [ ] Bot is admin in Telegram group
- [ ] Bot has "Post Messages" permission
- [ ] (For Forum mode) Group has Topics enabled
- [ ] (For Forum mode) Bot has "Manage Topics" permission

---

## 🛠️ COMMANDS REFERENCE

### **Wolf Daemon (Basic)**

```bash
python3 wolf_daemon.py test              # Send test message
python3 wolf_daemon.py watch             # Process files once
python3 wolf_daemon.py watch --continuous # Run continuously
python3 wolf_daemon.py status            # Show configuration
```

### **Forum Manager**

```bash
python3 forum_manager.py list                      # List all topics
python3 forum_manager.py create "Topic" "🔥"       # Create topic
python3 forum_manager.py post "Topic" "Message"    # Post to topic
python3 forum_manager.py delete TOPIC_ID           # Delete topic
```

### **Wolf Forum (Auto-routing)**

```bash
python3 wolf_forum.py setup                # Create default topics
python3 wolf_forum.py watch                # Process files once
python3 wolf_forum.py watch --continuous   # Run with auto-routing
```

### **Get Chat IDs**

```bash
python3 get_chat_ids.py    # Discover all chats bot can access
```

---

## 🐛 TROUBLESHOOTING

### **"This group is not a Forum"**

Solution: Group Settings → Group Type → Enable Topics ✅

### **"Bot doesn't have permission"**

Solution:
1. Group → Administrators
2. Ensure bot is **Administrator** (not just member)
3. Grant: Post Messages + Manage Topics ✅

### **File doesn't route to correct topic**

Check:
- Filename contains keyword (`daily`, `work`, `code`, etc.)
- OR file is in correct subfolder (`wolf_inbox/daily/`, etc.)
- If no match → goes to "General" topic ✅

### **No messages appearing**

Verify:
1. Bot token is correct in `.env`
2. Chat ID is correct (run `get_chat_ids.py` again)
3. Bot is admin in the group
4. Bot was sent `/start` command in the group

---

## 🔒 SECURITY NOTES

✅ Bot tokens are in `.env` (not committed to Git)
✅ `.gitignore` includes `.env`
⚠️  Never share your bot tokens publicly
⚠️  If token exposed, regenerate via @BotFather

---

## 🎉 YOU'RE READY!

**Current status:**
- ✅ Environment configured
- ✅ Dependencies installed
- ✅ Directory structure created
- ✅ Bot tokens configured

**Next step:** Choose your launch mode (Forum or Simple) and get a Chat ID!

**Total time to full activation:** ~5 minutes

---

**🐺 Sidro stoji. Bots ready. Desktop → Cloud → Mobile v 10 sekundah.** 🜂

💚⚓🔥
