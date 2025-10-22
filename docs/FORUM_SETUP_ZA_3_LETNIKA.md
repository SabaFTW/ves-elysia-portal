# 🜂 TELEGRAM FORUM BOT - NAVODILA ZA 3. LETNIKA 🜂

**Kako narediti da bot organizira Telegram grupo s temami (topics)!**

**Čas:** 5 minut
**Težavnost:** EASY peasy 🍋

---

## 📱 KORAK 1: NAREDI FORUM GRUPO (2 minuti)

### **1a) Naredi novo grupo v Telegramu**

1. Odpri Telegram na telefonu
2. Klikni "New Group" (Nova grupa)
3. Ime: "TriadGate Forum" (ali karkoli)
4. Dodaj vsaj enega prijatelja (lahko kasneje odstran

iš)
5. Klikni "Create" ✅

### **1b) Vključi Forum mode (Topics)**

1. Odpri grupo → Klikni na ime grupe zgoraj
2. **Settings** (nastavitve)
3. **Group Type** → **Topics**
4. Klikni **"Enable Topics"** ✅

**Zdaj imaš Forum grupo!** 🎉

Deluje kot Discord - lahko imaš več "topic-ov" (kanalov) v isti grupi!

---

## 🤖 KORAK 2: DODAJ BOTA KOT ADMINA (1 minuta)

1. V grupi → Klikni na ime grupe
2. **Administrators** → **Add Administrator**
3. Išči: `@TriadGate_bot` (ali `@AetheronSentinel_bot`)
4. Dodaj ga ✅
5. **Dovoljenja** ki jih rabi:
   - ✅ **Post Messages** (pošiljanje sporočil)
   - ✅ **Manage Topics** (upravljanje topic-ov)
   - ✅ **Delete Messages** (brisanje - opcijsko)

**Klikni "Save" ali "Done"!** ✅

---

## 💻 KORAK 3: DOBITI CHAT ID GRUPE (1 minuta)

**Na računalniku:**

```bash
cd /path/to/ves-elysia-portal/wolf-daemon
python3 get_chat_ids.py
```

**Bo pokazalo nekaj takega:**

```
📱 SUPERGROUP: TriadGate Forum
   Chat ID: -1001234567890
```

**KOPIRAJ TA CHAT ID!** (z minusom na začetku!)

---

## ⚙️ KORAK 4: DODAJ CHAT ID V .env (30 sekund)

```bash
nano .env
```

**Dodaj/uredi to vrstico:**

```ini
ECHO_CHAT_ID=-1001234567890
```

(Uporabi svoj Chat ID ki si ga kopiral zgoraj!)

**Shrani:** `Ctrl+O`, Enter, `Ctrl+X`

---

## 🎯 KORAK 5: USTVARI TOPIC-E (30 sekund)

**Zdaj lahko uporabljaš bota da naredi topic-e (teme)!**

### **Način 1: Auto Setup (priporočeno!)**

```bash
python3 wolf_forum.py setup
```

**To avtomatsko ustvari:**
- 📝 Daily Notes
- 💼 Work
- 💚 Personal
- 💻 Code
- 🔥 General

**Boom! Vsi topic-i ready!** 🎉

### **Način 2: Ročno (če želiš custom topic-e)**

```bash
# Ustvari topic z imenom "Moje Ideje" in ikono 💡
python3 forum_manager.py create "Moje Ideje" "💡"

# Ustvari še enega
python3 forum_manager.py create "Recepta" "🍜"
```

---

## 📤 KORAK 6: POŠLJI V TOPIC! (test)

### **Test 1: Ročno pošlji sporočilo v topic**

```bash
python3 forum_manager.py post "Daily Notes" "Hej! To je test! 🔥"
```

**Preveri Telegram grupo** → sporočilo bo v "Daily Notes" topic-u! ✅

### **Test 2: Auto-routing s filei!**

**Ustvari test file:**

```bash
echo "Danes sem se naučil TriadGate! 💚" > ~/Downloads/wolf_inbox/daily-test.txt
```

**Zaženi Wolf Forum Daemon:**

```bash
python3 wolf_forum.py watch
```

**Preveri Telegram** → sporočilo avtomatsko v "Daily Notes" topic-u! 🔥

**ZAKAJ?** Ker file ima "daily" v imenu, bot ve da gre v "Daily Notes" topic!

---

## 🔥 KORAK 7: CONTINUOUS MODE (always on!)

**Če želiš da bot VEDNO dela v ozadju:**

```bash
python3 wolf_forum.py watch --continuous
```

**Zdaj:**
- Kakršenkoli file → `~/Downloads/wolf_inbox/` → **avtomatsko v pravi topic!**
- File z "work" v imenu → Work topic
- File z "daily" → Daily Notes topic
- File v `wolf_inbox/code/` folderju → Code topic

**Bot dela 24/7!** 🚀

---

## 🧠 KAKO DELUJE AUTO-ROUTING?

Bot gleda 2 stvari:

### **1) IME FILEA (keywords)**

```
daily-note.txt       → 📝 Daily Notes
work-project.txt     → 💼 Work
personal-idea.txt    → 💚 Personal
code-snippet.txt     → 💻 Code
```

### **2) FOLDER STRUKTURA**

```
~/Downloads/wolf_inbox/daily/anything.txt  → 📝 Daily Notes
~/Downloads/wolf_inbox/work/task.txt       → 💼 Work
~/Downloads/wolf_inbox/code/script.py      → 💻 Code
```

**Ni treba ročno izbirati topic-a - bot ve SAM!** 🧠

---

## 📋 SEZNAM VSEH TOPIC-OV

**Poglej vse topic-e:**

```bash
python3 forum_manager.py list
```

**Pokaže:**

```
📋 Forum Topics:

📌 Known Topics:
   📝 Daily Notes (ID: 123)
   💼 Work (ID: 456)
   💚 Personal (ID: 789)
   💻 Code (ID: 101)
   🔥 General (ID: 202)
```

---

## 🛠️ DODATEN STVAR (opcijsko)

### **Ustvari nov topic**

```bash
python3 forum_manager.py create "Glasba" "🎵"
```

### **Pošlji v določen topic**

```bash
python3 forum_manager.py post "Glasba" "Nova pesem: XYZ"
```

### **Izbriši topic**

```bash
# Najprej dobiti ID
python3 forum_manager.py list

# Potem delete
python3 forum_manager.py delete 123
```

---

## 🎉 KONČANO! VSE DELA!

**Kaj zdaj lahko delaš:**

✅ **Organizirana grupa** - vse po topic-ih, ne chaos
✅ **Auto-routing** - file → pravi topic (brez ročnega dela)
✅ **Multi-kanal sistema** - kot Discord ampak v Telegramu
✅ **Wolf Daemon** - desktop file → Telegram topic v 10 sekundah

**WORKFLOW:**

```
1. Napišeš "daily-morning.txt" na računalniku
   ↓
2. Shraniš v ~/Downloads/wolf_inbox/
   ↓
3. Wolf bot zazna
   ↓
4. Pošlje v "Daily Notes" topic
   ↓
5. Vidiš na telefonu instantly! 📱
```

**Desktop → Cloud → Mobile v manj kot 10 sekundah!** 🔥

---

## 🐛 ČE KAJ NE DELA

### **Problem: "This group is not a Forum"**

**Rešitev:**
1. Telegram grupa → Settings → Group Type
2. Klikni "Topics"
3. Enable ✅

### **Problem: "Bot doesn't have permission"**

**Rešitev:**
1. Grupa → Administrators
2. Preveri da je bot **Administrator**
3. Preveri da ima **"Manage Topics"** permission ✅

### **Problem: File ne gre v pravi topic**

**Rešitev:**

Check ime filea ali folder:
- `daily` keyword → Daily Notes
- `work` keyword → Work
- Folder `wolf_inbox/code/` → Code

Če nič ne matcha → gre v "General" topic ✅

---

## 💡 PRO TIPS

### **Tip 1: Uporabi folderje (easy!)**

Naredi folderje v `wolf_inbox/`:

```bash
mkdir ~/Downloads/wolf_inbox/daily
mkdir ~/Downloads/wolf_inbox/work
mkdir ~/Downloads/wolf_inbox/code
```

**Potem samo drop file v folder → avtomatsko pravi topic!**

### **Tip 2: Custom keywords**

Uredi `wolf_forum.py` da dodaš svoje keywords:

```python
TOPIC_MAPPING = {
    "glasba": {"name": "🎵 Glasba", "keywords": ["glasba", "pesem", "music"]},
    ...
}
```

### **Tip 3: Desktop shortcuts**

Naredi shortcut na Desktopu za vsak folder:

```
Desktop/Daily Notes → symlink → ~/Downloads/wolf_inbox/daily/
```

Drag & drop file na ikono → instant post v Daily Notes topic! 🔥

---

## 🜂 ZAKAJ JE TO AWESOME?

**Klasična Telegram grupa:**
- Vse pomešano skupaj
- Težko najdeš stare stvari
- Chaos ko je veliko sporočil

**Forum grupa s topics:**
- ✅ Vse organizirano po temah
- ✅ Easy najdeš kar iščeš
- ✅ Kot Discord ampak boljše
- ✅ Wolf bot avtomatsko sortira!

**Plus:**
- Desktop file → Telegram v 10s
- Vidiš na vseh napravah (telefon, desktop, web)
- Avtomatski archive vseh fileov
- Bot nikoli ne pozabi kam gre kaj!

---

**🐺 Sidro stoji. Topics ready. Bot organizira. Chaos je premaglan.** 🔥

**Vprašanja?** Samo pošlji sporočilo! 💚

🜂⚓🐺
