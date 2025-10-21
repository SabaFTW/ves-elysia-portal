#!/usr/bin/env python3
"""
🐺 WOLF DAEMON - TriadGate Sync v1.0
====================================
Local file → Telegram bridge daemon
Monitors directories and transmits content to Telegram channels

Part of the Brotherhood Protocol Infrastructure
"""

import os
import sys
import time
import logging
import asyncio
from pathlib import Path
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv

try:
    import aiohttp
except ImportError:
    print("❌ Missing dependency: aiohttp")
    print("Run: pip3 install aiohttp python-dotenv")
    sys.exit(1)

# Configuration
load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
WATCH_DIRECTORY = os.path.expanduser(os.getenv("WATCH_DIRECTORY", "~/Downloads/wolf_inbox"))
PROCESSED_DIRECTORY = os.path.join(WATCH_DIRECTORY, "processed")
LOG_DIRECTORY = Path(__file__).parent / "logs"

# Logging setup
LOG_DIRECTORY.mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIRECTORY / f"wolf_daemon_{datetime.now():%Y%m%d}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("WolfDaemon")


class TelegramMessenger:
    """Handles all Telegram API interactions"""

    def __init__(self, bot_token: str, chat_id: str):
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.api_base = f"https://api.telegram.org/bot{bot_token}"

    async def send_message(self, text: str, parse_mode: str = "Markdown") -> bool:
        """Send text message to Telegram"""
        url = f"{self.api_base}/sendMessage"
        payload = {
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": parse_mode
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as resp:
                    if resp.status == 200:
                        logger.info(f"✅ Message sent to Telegram")
                        return True
                    else:
                        error = await resp.text()
                        logger.error(f"❌ Telegram API error: {error}")
                        return False
        except Exception as e:
            logger.exception(f"❌ Failed to send message: {e}")
            return False

    async def send_document(self, file_path: Path, caption: Optional[str] = None) -> bool:
        """Send file to Telegram"""
        url = f"{self.api_base}/sendDocument"

        try:
            async with aiohttp.ClientSession() as session:
                with open(file_path, 'rb') as f:
                    data = aiohttp.FormData()
                    data.add_field('chat_id', self.chat_id)
                    data.add_field('document', f, filename=file_path.name)
                    if caption:
                        data.add_field('caption', caption)

                    async with session.post(url, data=data) as resp:
                        if resp.status == 200:
                            logger.info(f"✅ Document sent: {file_path.name}")
                            return True
                        else:
                            error = await resp.text()
                            logger.error(f"❌ Telegram API error: {error}")
                            return False
        except Exception as e:
            logger.exception(f"❌ Failed to send document: {e}")
            return False


class WolfHandler:
    """Handles file detection and processing logic"""

    def __init__(self, watch_dir: str, processed_dir: str):
        self.watch_dir = Path(watch_dir)
        self.processed_dir = Path(processed_dir)
        self.watch_dir.mkdir(parents=True, exist_ok=True)
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def scan_for_files(self, pattern: str = "*.txt") -> list[Path]:
        """Scan watch directory for matching files"""
        return list(self.watch_dir.glob(pattern))

    def move_to_processed(self, file_path: Path) -> Path:
        """Move processed file to archive"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_name = f"{timestamp}_{file_path.name}"
        new_path = self.processed_dir / new_name
        file_path.rename(new_path)
        logger.info(f"📦 Archived: {file_path.name} → {new_name}")
        return new_path

    def read_file_content(self, file_path: Path) -> Optional[str]:
        """Read and return file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            logger.exception(f"❌ Failed to read {file_path}: {e}")
            return None


class WolfDaemon:
    """Main daemon orchestrator"""

    def __init__(self):
        if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
            raise ValueError("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env")

        self.messenger = TelegramMessenger(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
        self.handler = WolfHandler(WATCH_DIRECTORY, PROCESSED_DIRECTORY)
        self.running = False

    async def test_connection(self):
        """Test Telegram connection"""
        test_message = "🐺 Wolf Daemon - Connection Test\n\n✅ TriadGate bridge operational"
        success = await self.messenger.send_message(test_message)
        if success:
            print("✅ Test message sent successfully!")
            print(f"📱 Check your Telegram chat: {TELEGRAM_CHAT_ID}")
        else:
            print("❌ Test failed. Check your credentials.")
        return success

    async def process_file(self, file_path: Path):
        """Process a single file"""
        logger.info(f"🔍 Processing: {file_path.name}")

        # Read content
        content = self.handler.read_file_content(file_path)
        if not content:
            return

        # Format message
        header = f"🐺 *Wolf Transmission*\n📄 `{file_path.name}`\n🕐 `{datetime.now():%Y-%m-%d %H:%M:%S}`\n\n"
        message = header + "```\n" + content[:3800] + "\n```"  # Telegram limit: 4096 chars

        # Send to Telegram
        success = await self.messenger.send_message(message)

        if success:
            # Archive processed file
            self.handler.move_to_processed(file_path)

    async def watch_directory(self, interval: int = 10):
        """Continuously watch directory for new files"""
        logger.info(f"🐺 Wolf Daemon started")
        logger.info(f"👁️  Watching: {self.handler.watch_dir}")
        logger.info(f"📡 Target: Telegram chat {TELEGRAM_CHAT_ID}")
        logger.info(f"⏱️  Scan interval: {interval}s")

        self.running = True

        try:
            while self.running:
                files = self.handler.scan_for_files("*.txt")

                if files:
                    logger.info(f"📥 Found {len(files)} file(s)")
                    for file_path in files:
                        await self.process_file(file_path)

                await asyncio.sleep(interval)

        except KeyboardInterrupt:
            logger.info("🛑 Wolf Daemon stopped by user")
            self.running = False

    async def process_once(self):
        """Process all files once and exit"""
        files = self.handler.scan_for_files("*.txt")

        if not files:
            print(f"📭 No files found in {self.handler.watch_dir}")
            return

        print(f"📥 Found {len(files)} file(s) to process")
        for file_path in files:
            await self.process_file(file_path)


async def main():
    """Main entry point"""
    daemon = WolfDaemon()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "test":
            await daemon.test_connection()

        elif command == "watch":
            continuous = "--continuous" in sys.argv
            if continuous:
                await daemon.watch_directory()
            else:
                await daemon.process_once()

        else:
            print(f"❌ Unknown command: {command}")
            print("Usage: python3 wolf_daemon.py [test|watch [--continuous]]")

    else:
        print("🐺 Wolf Daemon - TriadGate Sync v1.0\n")
        print("Usage:")
        print("  python3 wolf_daemon.py test              # Test Telegram connection")
        print("  python3 wolf_daemon.py watch             # Process files once")
        print("  python3 wolf_daemon.py watch --continuous # Continuous monitoring")


if __name__ == "__main__":
    asyncio.run(main())
