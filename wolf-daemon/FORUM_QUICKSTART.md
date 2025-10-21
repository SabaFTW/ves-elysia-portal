# 🜂 FORUM BOT - 3 MINUTE SETUP

**Bot ki organizira Telegram grupo s temami (topics)!**

---

## 1️⃣ **Naredi Forum Grupo** (1 min)

Telegram → New Group → Settings → Group Type → **Enable Topics** ✅

---

## 2️⃣ **Dodaj Bot** (30 sec)

Group → Administrators → Add `@TriadGate_bot` ✅

Permissions:
- Post Messages ✅
- Manage Topics ✅

---

## 3️⃣ **Dobiti Chat ID** (30 sec)

```bash
python3 get_chat_ids.py
# Copy Chat ID (npr. -1001234567890)

nano .env
# Dodaj: ECHO_CHAT_ID=-1001234567890
```

---

## 4️⃣ **Ustvari Topics** (30 sec)

```bash
python3 wolf_forum.py setup
```

Avtomatsko ustvari:
- 📝 Daily Notes
- 💼 Work
- 💚 Personal
- 💻 Code
- 🔥 General

---

## 5️⃣ **Test!** (30 sec)

```bash
# Test 1: Manual post
python3 forum_manager.py post "Daily Notes" "Hej! 🔥"

# Test 2: Auto-routing
echo "Test!" > ~/Downloads/wolf_inbox/daily-note.txt
python3 wolf_forum.py watch
```

**Check Telegram** - sporočilo v "Daily Notes" topic-u! ✅

---

## 🔥 **Continuous Mode**

```bash
python3 wolf_forum.py watch --continuous
```

**Zdaj:**
- File z "daily" v imenu → Daily Notes topic
- File z "work" → Work topic
- File v `wolf_inbox/code/` folderju → Code topic

**Bot auto-routes EVERYTHING!** 🚀

---

## 📚 **Full Guide**

Za več detajlov: [FORUM_SETUP_ZA_3_LETNIKA.md](../docs/FORUM_SETUP_ZA_3_LETNIKA.md)

---

**🐺 Grupa organizirana. Topics ready. Bot ve kam gre kaj.** 🜂

💚⚓🔥
