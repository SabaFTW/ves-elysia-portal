#!/usr/bin/env python3
"""
🐺🜂 WOLF DAEMON + FORUM INTEGRATION 🜂🐺
=========================================
Enhanced Wolf Daemon that posts to specific Forum Topics!

Features:
- Auto-routing based on filename
- Topic creation from folder structure
- Smart categorization

File naming patterns:
  daily-note.txt       → Posts to "Daily Notes" topic
  work-project.txt     → Posts to "Work" topic
  personal-idea.txt    → Posts to "Personal" topic

Or use folder structure:
  wolf_inbox/daily/note.txt    → "Daily Notes" topic
  wolf_inbox/work/task.txt     → "Work" topic

Usage:
  python3 wolf_forum.py watch --continuous  # Auto-route to topics
  python3 wolf_forum.py setup               # Create default topics
"""

import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

try:
    import aiohttp
except ImportError:
    print("❌ Missing: pip3 install aiohttp python-dotenv")
    sys.exit(1)

load_dotenv()

BOT_TOKEN = os.getenv("ECHO_BOT_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("ECHO_CHAT_ID") or os.getenv("TELEGRAM_CHAT_ID")
WATCH_DIR = Path(os.getenv("WATCH_DIRECTORY", "~/Downloads/wolf_inbox")).expanduser()
PROCESSED_DIR = WATCH_DIR / "processed"

API_BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"

# Default topic mapping
TOPIC_MAPPING = {
    "daily": {"name": "📝 Daily Notes", "keywords": ["daily", "journal", "morning"]},
    "work": {"name": "💼 Work", "keywords": ["work", "project", "task"]},
    "personal": {"name": "💚 Personal", "keywords": ["personal", "idea", "thought"]},
    "code": {"name": "💻 Code", "keywords": ["code", "dev", "programming"]},
    "general": {"name": "🔥 General", "keywords": []},  # Default fallback
}


class WolfForum:
    """Wolf Daemon with Forum Topic support"""

    def __init__(self):
        self.topics = {}  # topic_name -> topic_id mapping
        self._load_topics()

    def _load_topics(self):
        """Load known topics from local storage"""
        import json

        topics_file = Path(".forum_topics.json")
        if topics_file.exists():
            with open(topics_file) as f:
                stored = json.load(f)
                for topic in stored:
                    self.topics[topic["name"]] = topic["id"]

    async def _api_call(self, method: str, params: dict):
        """Telegram API call"""
        url = f"{API_BASE}/{method}"

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=params) as resp:
                data = await resp.json()
                if not data.get("ok"):
                    raise Exception(data.get("description", "API Error"))
                return data.get("result")

    async def create_default_topics(self):
        """Create default forum topics"""
        print("🜂 Setting up default Forum topics...")
        print()

        for key, info in TOPIC_MAPPING.items():
            topic_name = info["name"]

            if topic_name in self.topics:
                print(f"✅ {topic_name} - already exists (ID: {self.topics[topic_name]})")
                continue

            try:
                result = await self._api_call("createForumTopic", {
                    "chat_id": CHAT_ID,
                    "name": topic_name
                })

                topic_id = result.get("message_thread_id")
                self.topics[topic_name] = topic_id

                print(f"✅ {topic_name} - created (ID: {topic_id})")

                # Save to local storage
                self._save_topic(topic_id, topic_name, info["name"][0])

            except Exception as e:
                print(f"❌ {topic_name} - failed: {e}")

        print()
        print("✅ Forum setup complete!")
        print(f"📊 Total topics: {len(self.topics)}")

    def _save_topic(self, topic_id: int, name: str, icon: str):
        """Save topic locally"""
        import json

        topics_file = Path(".forum_topics.json")
        topics = []

        if topics_file.exists():
            with open(topics_file) as f:
                topics = json.load(f)

        # Check if already exists
        if not any(t["id"] == topic_id for t in topics):
            topics.append({
                "id": topic_id,
                "name": name,
                "icon": icon
            })

            with open(topics_file, "w") as f:
                json.dump(topics, f, indent=2)

    def detect_topic(self, file_path: Path) -> str:
        """Detect which topic a file should go to"""

        # Method 1: Check subfolder
        relative = file_path.relative_to(WATCH_DIR)
        if len(relative.parts) > 1:
            folder = relative.parts[0]
            for key, info in TOPIC_MAPPING.items():
                if folder.lower() == key:
                    return info["name"]

        # Method 2: Check filename keywords
        filename = file_path.stem.lower()

        for key, info in TOPIC_MAPPING.items():
            for keyword in info["keywords"]:
                if keyword in filename:
                    return info["name"]

        # Default: General
        return TOPIC_MAPPING["general"]["name"]

    async def post_to_topic(self, topic_name: str, file_path: Path):
        """Post file content to specific topic"""

        # Get topic ID
        topic_id = self.topics.get(topic_name)

        if not topic_id:
            print(f"⚠️  Topic '{topic_name}' not found, posting to general chat")
            topic_id = None  # Will post to main chat

        # Read file
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f"❌ Failed to read {file_path}: {e}")
            return False

        # Format message
        header = f"🐺 *Wolf Transmission*\n"
        header += f"📁 Topic: {topic_name}\n"
        header += f"📄 `{file_path.name}`\n"
        header += f"🕐 `{datetime.now():%Y-%m-%d %H:%M:%S}`\n\n"

        message = header + "```\n" + content[:3500] + "\n```"

        # Send to Telegram
        try:
            params = {
                "chat_id": CHAT_ID,
                "text": message,
                "parse_mode": "Markdown"
            }

            if topic_id:
                params["message_thread_id"] = topic_id

            await self._api_call("sendMessage", params)

            print(f"✅ Posted to '{topic_name}' (ID: {topic_id})")
            return True

        except Exception as e:
            print(f"❌ Failed to post: {e}")
            return False

    async def process_file(self, file_path: Path):
        """Process a single file and route to correct topic"""

        print(f"🔍 Processing: {file_path.name}")

        # Detect topic
        topic_name = self.detect_topic(file_path)
        print(f"📌 Routing to: {topic_name}")

        # Post to topic
        success = await self.post_to_topic(topic_name, file_path)

        if success:
            # Move to processed
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            new_path = PROCESSED_DIR / f"{timestamp}_{file_path.name}"
            file_path.rename(new_path)
            print(f"📦 Archived: {new_path.name}")

        print()

    async def watch(self):
        """Watch directory and auto-route files"""

        print("🐺🜂 Wolf Forum Daemon - Started")
        print(f"👁️  Watching: {WATCH_DIR}")
        print(f"📡 Posting to: {CHAT_ID}")
        print(f"🜂 Topics configured: {len(self.topics)}")
        print()

        # Ensure directories exist
        WATCH_DIR.mkdir(parents=True, exist_ok=True)
        PROCESSED_DIR.mkdir(exist_ok=True)

        # Create subfolders for easy routing
        for key in TOPIC_MAPPING.keys():
            (WATCH_DIR / key).mkdir(exist_ok=True)

        try:
            while True:
                # Scan for .txt files
                files = list(WATCH_DIR.glob("*.txt"))

                # Also scan subfolders
                for subfolder in WATCH_DIR.iterdir():
                    if subfolder.is_dir() and subfolder.name != "processed":
                        files.extend(subfolder.glob("*.txt"))

                if files:
                    print(f"📥 Found {len(files)} file(s)")
                    for file_path in files:
                        await self.process_file(file_path)

                await asyncio.sleep(10)  # Check every 10 seconds

        except KeyboardInterrupt:
            print("\n🛑 Wolf Forum Daemon stopped")


async def main():
    if not BOT_TOKEN or not CHAT_ID:
        print("❌ Missing configuration!")
        print()
        print("Set in .env:")
        print("  ECHO_BOT_TOKEN=your_token")
        print("  ECHO_CHAT_ID=-100xxxxxxxxx")
        print()
        return

    wolf = WolfForum()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "setup":
            await wolf.create_default_topics()

        elif command == "watch":
            continuous = "--continuous" in sys.argv
            if continuous:
                await wolf.watch()
            else:
                files = list(WATCH_DIR.glob("*.txt"))
                if files:
                    for f in files:
                        await wolf.process_file(f)
                else:
                    print(f"📭 No files in {WATCH_DIR}")

        else:
            print(f"Unknown command: {command}")

    else:
        print("🐺🜂 WOLF FORUM DAEMON 🜂🐺")
        print("=" * 50)
        print()
        print("Usage:")
        print("  python3 wolf_forum.py setup              # Create default topics")
        print("  python3 wolf_forum.py watch              # Process files once")
        print("  python3 wolf_forum.py watch --continuous # Continuous monitoring")
        print()
        print("Topic Routing:")
        print("  Method 1 - Subfolders:")
        print("    ~/Downloads/wolf_inbox/daily/note.txt  → Daily Notes")
        print("    ~/Downloads/wolf_inbox/work/task.txt   → Work")
        print()
        print("  Method 2 - Filename keywords:")
        print("    daily-reflection.txt  → Daily Notes")
        print("    work-project.txt      → Work")
        print("    code-snippet.txt      → Code")
        print()


if __name__ == "__main__":
    asyncio.run(main())
