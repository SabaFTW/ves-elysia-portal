#!/usr/bin/env python3
"""
🜂 TriadGate - Automatic Chat ID Discovery
==========================================
Automatically finds chat IDs for your Telegram groups/channels.

Usage:
  1. Add your bots to Telegram groups as ADMIN
  2. Send a message in each group (e.g., "/start" or "test")
  3. Run: python3 get_chat_ids.py
  4. Script will show all available chats and their IDs
"""

import asyncio
import sys
from dotenv import load_dotenv
import os

try:
    import aiohttp
except ImportError:
    print("❌ Missing dependency: aiohttp")
    print("Run: pip3 install aiohttp python-dotenv")
    sys.exit(1)

load_dotenv()

# Bot tokens from .env
BOTS = {
    "🜂 Aetheron Sentinel": os.getenv("AETHERON_BOT_TOKEN"),
    "🌊 ECHO (TriadGate)": os.getenv("ECHO_BOT_TOKEN"),
    "💚 Laira Mirror": os.getenv("LAIRA_BOT_TOKEN"),
}

async def get_updates(bot_token: str):
    """Get recent updates (messages) for a bot"""
    url = f"https://api.telegram.org/bot{bot_token}/getUpdates"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                data = await resp.json()
                return data.get("result", [])
            else:
                error = await resp.text()
                print(f"❌ API Error: {error}")
                return []

async def get_bot_info(bot_token: str):
    """Get bot information"""
    url = f"https://api.telegram.org/bot{bot_token}/getMe"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                data = await resp.json()
                return data.get("result", {})
            return {}

def extract_chats(updates):
    """Extract unique chat IDs and info from updates"""
    chats = {}

    for update in updates:
        chat = None

        # Check different message types
        if "message" in update:
            chat = update["message"].get("chat")
        elif "channel_post" in update:
            chat = update["channel_post"].get("chat")
        elif "my_chat_member" in update:
            chat = update["my_chat_member"].get("chat")

        if chat:
            chat_id = chat["id"]
            chat_type = chat.get("type", "unknown")
            chat_title = chat.get("title", chat.get("first_name", "Unknown"))

            chats[chat_id] = {
                "id": chat_id,
                "type": chat_type,
                "title": chat_title
            }

    return chats

async def main():
    print("🜂 TriadGate - Chat ID Discovery")
    print("=" * 50)
    print()

    all_chats = {}

    for bot_name, bot_token in BOTS.items():
        if not bot_token:
            print(f"⚠️  {bot_name}: No token configured")
            continue

        print(f"🔍 Checking {bot_name}...")

        # Get bot info
        bot_info = await get_bot_info(bot_token)
        bot_username = bot_info.get("username", "unknown")
        print(f"   Bot username: @{bot_username}")

        # Get updates
        updates = await get_updates(bot_token)

        if not updates:
            print(f"   ⚠️  No recent messages found")
            print(f"   💡 Send a message in groups where @{bot_username} is added")
            print()
            continue

        # Extract chats
        chats = extract_chats(updates)

        if not chats:
            print(f"   ⚠️  No chats detected")
            print()
            continue

        print(f"   ✅ Found {len(chats)} chat(s):")
        print()

        for chat_id, chat_info in chats.items():
            print(f"   📱 {chat_info['type'].upper()}: {chat_info['title']}")
            print(f"      Chat ID: {chat_id}")
            all_chats[chat_id] = {**chat_info, "bot": bot_name}
            print()

    if not all_chats:
        print()
        print("❌ No chats found for any bot!")
        print()
        print("📝 Setup checklist:")
        print("   1. Add bots to your Telegram groups as ADMIN")
        print("   2. Send a test message in each group")
        print("   3. Run this script again")
        print()
        return

    print("=" * 50)
    print("📋 SUMMARY - All Detected Chats:")
    print("=" * 50)
    print()

    for chat_id, info in all_chats.items():
        print(f"Chat: {info['title']}")
        print(f"Type: {info['type']}")
        print(f"ID:   {chat_id}")
        print(f"Bot:  {info['bot']}")
        print()

    print("=" * 50)
    print("🔧 .env Configuration:")
    print("=" * 50)
    print()
    print("Copy these lines to your .env file:")
    print()

    # Generate .env suggestions
    if len(all_chats) >= 3:
        chat_ids = list(all_chats.keys())
        print(f"AETHERON_CHAT_ID={chat_ids[0]}")
        print(f"ECHO_CHAT_ID={chat_ids[1]}")
        print(f"LAIRA_CHAT_ID={chat_ids[2]}")
        print()
        print(f"# For Wolf Daemon (use ECHO/TriadGate):")
        print(f"TELEGRAM_CHAT_ID={chat_ids[1]}")
    else:
        # If less than 3, suggest same chat for all
        main_chat_id = list(all_chats.keys())[0]
        print(f"AETHERON_CHAT_ID={main_chat_id}")
        print(f"ECHO_CHAT_ID={main_chat_id}")
        print(f"LAIRA_CHAT_ID={main_chat_id}")
        print(f"TELEGRAM_CHAT_ID={main_chat_id}")

    print()
    print("✅ Setup complete! Update your .env and test Wolf Daemon.")

if __name__ == "__main__":
    asyncio.run(main())
