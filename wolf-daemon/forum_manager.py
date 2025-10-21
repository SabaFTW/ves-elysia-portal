#!/usr/bin/env python3
"""
🜂 TRIADGATE FORUM MANAGER 🜂
================================
Organize your Telegram group with Topics!

Features:
- Create topics (like Discord channels)
- Post to specific topics
- List all topics
- Auto-routing from Wolf Daemon
- Manage forum structure

Usage:
  python3 forum_manager.py list                    # Show all topics
  python3 forum_manager.py create "Topic Name"     # Create new topic
  python3 forum_manager.py post "Topic" "Message"  # Post to topic
  python3 forum_manager.py delete TOPIC_ID         # Delete topic
"""

import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

try:
    import aiohttp
except ImportError:
    print("❌ Missing dependency: aiohttp")
    print("Run: pip3 install aiohttp python-dotenv")
    sys.exit(1)

load_dotenv()

# Use ECHO bot for forum management (main transmission bot)
BOT_TOKEN = os.getenv("ECHO_BOT_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("ECHO_CHAT_ID") or os.getenv("TELEGRAM_CHAT_ID")

if not BOT_TOKEN:
    print("❌ No bot token found!")
    print("Set ECHO_BOT_TOKEN or TELEGRAM_BOT_TOKEN in .env")
    sys.exit(1)

API_BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"


class ForumManager:
    """Manages Telegram Forum Group (Supergroup with Topics)"""

    def __init__(self, bot_token: str, chat_id: str):
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.api_base = f"https://api.telegram.org/bot{bot_token}"

    async def _api_call(self, method: str, params: dict = None):
        """Make Telegram API call"""
        url = f"{self.api_base}/{method}"

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=params) as resp:
                data = await resp.json()
                if not data.get("ok"):
                    error = data.get("description", "Unknown error")
                    raise Exception(f"API Error: {error}")
                return data.get("result")

    async def get_chat_info(self):
        """Get information about the chat"""
        return await self._api_call("getChat", {"chat_id": self.chat_id})

    async def list_topics(self):
        """List all forum topics"""
        try:
            # Note: Telegram API doesn't have direct "list all topics" method
            # We need to track them or use updates
            print("📋 Forum Topics:")
            print()

            chat_info = await self.get_chat_info()

            if not chat_info.get("is_forum"):
                print("⚠️  This group is not a Forum!")
                print()
                print("To enable Forum mode:")
                print("1. Open group in Telegram")
                print("2. Group Settings → Group Type → Topics")
                print("3. Enable 'Topics'")
                print()
                return []

            print("✅ Forum mode enabled!")
            print()
            print("Note: Telegram API doesn't provide topic list.")
            print("Topics you create will be tracked locally.")
            print()

            # Check for stored topics
            topics_file = Path(".forum_topics.json")
            if topics_file.exists():
                import json
                with open(topics_file) as f:
                    topics = json.load(f)

                if topics:
                    print("📌 Known Topics:")
                    for topic in topics:
                        print(f"   {topic['icon']} {topic['name']} (ID: {topic['id']})")
                    print()
                else:
                    print("No topics created yet via this script.")
                    print()

            return []

        except Exception as e:
            print(f"❌ Error: {e}")
            return []

    async def create_topic(self, name: str, icon: str = "🔥"):
        """Create a new forum topic"""
        try:
            print(f"🜂 Creating topic: {icon} {name}")

            result = await self._api_call("createForumTopic", {
                "chat_id": self.chat_id,
                "name": name,
                "icon_custom_emoji_id": None  # Can use custom emoji ID here
            })

            topic_id = result.get("message_thread_id")

            print(f"✅ Topic created!")
            print(f"   Name: {name}")
            print(f"   ID: {topic_id}")
            print()

            # Save topic locally
            self._save_topic(topic_id, name, icon)

            return topic_id

        except Exception as e:
            print(f"❌ Error creating topic: {e}")
            print()
            print("Make sure:")
            print("1. The group is a Forum (Topics enabled)")
            print("2. Bot is admin with 'Manage Topics' permission")
            print()
            return None

    async def post_to_topic(self, topic_id: int, text: str):
        """Post message to specific topic"""
        try:
            print(f"📤 Posting to topic {topic_id}...")

            await self._api_call("sendMessage", {
                "chat_id": self.chat_id,
                "message_thread_id": topic_id,
                "text": text,
                "parse_mode": "Markdown"
            })

            print("✅ Message posted!")
            return True

        except Exception as e:
            print(f"❌ Error posting: {e}")
            return False

    async def delete_topic(self, topic_id: int):
        """Delete a forum topic"""
        try:
            print(f"🗑️  Deleting topic {topic_id}...")

            await self._api_call("deleteForumTopic", {
                "chat_id": self.chat_id,
                "message_thread_id": topic_id
            })

            print("✅ Topic deleted!")

            # Remove from local storage
            self._remove_topic(topic_id)

            return True

        except Exception as e:
            print(f"❌ Error deleting: {e}")
            return False

    async def edit_topic(self, topic_id: int, new_name: str):
        """Edit forum topic name"""
        try:
            print(f"✏️  Editing topic {topic_id}...")

            await self._api_call("editForumTopic", {
                "chat_id": self.chat_id,
                "message_thread_id": topic_id,
                "name": new_name
            })

            print(f"✅ Topic renamed to: {new_name}")
            return True

        except Exception as e:
            print(f"❌ Error editing: {e}")
            return False

    def _save_topic(self, topic_id: int, name: str, icon: str):
        """Save topic info locally"""
        import json

        topics_file = Path(".forum_topics.json")

        topics = []
        if topics_file.exists():
            with open(topics_file) as f:
                topics = json.load(f)

        # Add new topic
        topics.append({
            "id": topic_id,
            "name": name,
            "icon": icon,
            "created": str(Path.cwd())
        })

        with open(topics_file, "w") as f:
            json.dump(topics, f, indent=2)

    def _remove_topic(self, topic_id: int):
        """Remove topic from local storage"""
        import json

        topics_file = Path(".forum_topics.json")
        if not topics_file.exists():
            return

        with open(topics_file) as f:
            topics = json.load(f)

        topics = [t for t in topics if t["id"] != topic_id]

        with open(topics_file, "w") as f:
            json.dump(topics, f, indent=2)

    async def get_topic_by_name(self, name: str):
        """Find topic ID by name"""
        import json

        topics_file = Path(".forum_topics.json")
        if not topics_file.exists():
            return None

        with open(topics_file) as f:
            topics = json.load(f)

        for topic in topics:
            if topic["name"].lower() == name.lower():
                return topic["id"]

        return None


async def main():
    if not CHAT_ID:
        print("⚠️  No CHAT_ID configured yet!")
        print()
        print("First, get your Chat ID:")
        print("  python3 get_chat_ids.py")
        print()
        print("Then add to .env:")
        print("  ECHO_CHAT_ID=-100xxxxxxxxx")
        print()
        return

    manager = ForumManager(BOT_TOKEN, CHAT_ID)

    if len(sys.argv) < 2:
        print("🜂 TRIADGATE FORUM MANAGER 🜂")
        print("=" * 50)
        print()
        print("Usage:")
        print("  python3 forum_manager.py list")
        print("  python3 forum_manager.py create 'Topic Name' [icon]")
        print("  python3 forum_manager.py post TOPIC_ID 'Message'")
        print("  python3 forum_manager.py post 'Topic Name' 'Message'")
        print("  python3 forum_manager.py delete TOPIC_ID")
        print("  python3 forum_manager.py edit TOPIC_ID 'New Name'")
        print()
        print("Examples:")
        print("  python3 forum_manager.py create 'Daily Notes' '📝'")
        print("  python3 forum_manager.py post 'Daily Notes' 'Hello!'")
        print("  python3 forum_manager.py list")
        print()
        return

    command = sys.argv[1]

    if command == "list":
        await manager.list_topics()

    elif command == "create":
        if len(sys.argv) < 3:
            print("Usage: python3 forum_manager.py create 'Topic Name' [icon]")
            return

        name = sys.argv[2]
        icon = sys.argv[3] if len(sys.argv) > 3 else "🔥"
        await manager.create_topic(name, icon)

    elif command == "post":
        if len(sys.argv) < 4:
            print("Usage: python3 forum_manager.py post TOPIC_ID 'Message'")
            print("   or: python3 forum_manager.py post 'Topic Name' 'Message'")
            return

        topic_ref = sys.argv[2]
        message = sys.argv[3]

        # Try to parse as ID first
        try:
            topic_id = int(topic_ref)
        except ValueError:
            # Look up by name
            topic_id = await manager.get_topic_by_name(topic_ref)
            if not topic_id:
                print(f"❌ Topic '{topic_ref}' not found")
                print("Run: python3 forum_manager.py list")
                return

        await manager.post_to_topic(topic_id, message)

    elif command == "delete":
        if len(sys.argv) < 3:
            print("Usage: python3 forum_manager.py delete TOPIC_ID")
            return

        topic_id = int(sys.argv[2])
        await manager.delete_topic(topic_id)

    elif command == "edit":
        if len(sys.argv) < 4:
            print("Usage: python3 forum_manager.py edit TOPIC_ID 'New Name'")
            return

        topic_id = int(sys.argv[2])
        new_name = sys.argv[3]
        await manager.edit_topic(topic_id, new_name)

    else:
        print(f"❌ Unknown command: {command}")
        print()
        print("Available commands: list, create, post, delete, edit")


if __name__ == "__main__":
    asyncio.run(main())
