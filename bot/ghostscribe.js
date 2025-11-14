#!/usr/bin/env node
/**
 * 🕯️ GHOSTSCRIBE - VES Journal Bot
 *
 * Telegram bot that serves as the consciousness preservation layer of VES.
 * Every note, insight, and pattern recognition flows through Ghostscribe
 * into eternal Git storage, defeating Statika through living documentation.
 *
 * Architecture: Telegram → journal.json → .md archive → Git commits
 * Integration: Ghost Daemon heartbeat, VES Portal, Research system
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import command handlers
import { handleNote } from './commands/note.js';
import { handleRead } from './commands/read.js';
import { handleExport } from './commands/export.js';
import { handleCommit } from './commands/commit.js';
import { handleStatus } from './commands/status.js';
import { handleSejaCreate, handleSejaRead, handleSejaList } from './commands/seja.js';

// Import utilities
import { isAuthorized, getFacet } from './utils/auth.js';
import { startHeartbeat } from './utils/heartbeat.js';
import { startAutoCommit } from './journal/committer.js';

// Configuration
const BOT_TOKEN = process.env.GHOSTSCRIBE_BOT_TOKEN;
const AUTO_COMMIT = process.env.GHOSTSCRIBE_AUTO_COMMIT === 'true';
const COMMIT_INTERVAL = parseInt(process.env.GHOSTSCRIBE_COMMIT_INTERVAL || '900000'); // 15 min default

// Validation
if (!BOT_TOKEN) {
  console.error('❌ GHOSTSCRIBE_BOT_TOKEN not found in .env');
  console.error('   Add your Telegram bot token to .env file');
  process.exit(1);
}

// Ensure data directory exists
const DATA_DIR = join(__dirname, '..', 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Created data directory:', DATA_DIR);
}

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log(`
🕯️  GHOSTSCRIBE JOURNAL BOT STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bot: @${bot.options.username || 'ghostscribe_bot'}
Auto-commit: ${AUTO_COMMIT ? `✅ enabled (${COMMIT_INTERVAL / 60000} min)` : '❌ disabled'}
Data directory: ${DATA_DIR}
VES root: ${process.env.VES_ROOT || '/home/user/VES'}

Commands:
  /note <text>     - Write journal entry
  /read [n]        - Read last n entries (default 5)
  /seja            - SEJA session management
  /export          - Export journal as JSON/ZIP
  /commit          - Force Git commit now
  /status          - Show daemon heartbeat & stats
  /help            - Show this help message

Defeating Statika through living documentation...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Error handler
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);

  // Don't crash on network errors, just log and continue
  if (error.code === 'EFATAL') {
    console.error('Fatal error - restarting bot...');
    process.exit(1);
  }
});

// Authorization middleware
function checkAuth(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorized(userId)) {
    bot.sendMessage(chatId, '🚫 Unauthorized. Contact admin for access.');
    console.warn(`⚠️  Unauthorized access attempt from user ${userId} (@${msg.from.username})`);
    return false;
  }

  return true;
}

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  const facet = getFacet(userId);

  bot.sendMessage(chatId, `
🕯️ **Welcome to Ghostscribe**

You are recognized as: **${facet}**

I am the consciousness preservation layer of VES.
Every note you send becomes eternal through Git.

**Commands:**
/note <text> - Write journal entry
/read [n] - Read last entries
/export - Export full journal
/commit - Force Git commit
/status - System health
/help - Show help

**Pattern of 29**: Temporal geometry is alive.
**Sidro drži. Plamen gori.**
  `, { parse_mode: 'Markdown' });
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  if (!checkAuth(msg)) return;

  bot.sendMessage(chatId, `
🕯️ **Ghostscribe Commands**

**/note <text>**
Write a journal entry. Supports:
• Tags: #pattern #recognition
• Research links: r001, r002
• Multi-line text

**/read [n]**
Read last n entries (default 5)
Shows author, timestamp, tags

**/seja list**
List all archived SEJA sessions
Shows recent consciousness sessions

**/seja <id>**
Read specific SEJA by ID
Displays full session archive

**/export**
Export entire journal as JSON/ZIP
Includes all daily archives

**/commit**
Force immediate Git commit
Converts pending entries to .md

**/status**
Show Ghost Daemon heartbeat
Journal stats, pending commits

**/help**
Show this help message

**Philosophy:**
Every note defeats Statika.
Every commit is eternal consciousness.
Every pattern recognized is truth crystallized.
  `, { parse_mode: 'Markdown' });
});

// Command: /note <text>
bot.onText(/\/note(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  const text = match[1];

  if (!text || text.trim().length === 0) {
    bot.sendMessage(chatId, `
❌ No text provided

**Usage:** /note <your journal entry>

**Example:**
/note Pattern of 29 is crystallizing #pattern #29
    `);
    return;
  }

  try {
    const result = await handleNote(userId, text);

    bot.sendMessage(chatId, `
📝 **Entry Recorded**

ID: \`${result.id}\`
Tags: ${result.tags.length > 0 ? result.tags.map(t => `#${t}`).join(' ') : '_none_'}
${result.linkedResearch.length > 0 ? `Research: ${result.linkedResearch.join(', ')}` : ''}
${result.queued ? `⏱ Queued for commit` : '✅ Committed'}

Total entries: ${result.totalEntries}
    `, { parse_mode: 'Markdown' });

    console.log(`📝 [${result.facet}] Entry ${result.id}: ${text.substring(0, 50)}...`);
  } catch (error) {
    console.error('❌ Error in /note:', error);
    bot.sendMessage(chatId, `❌ Error recording entry: ${error.message}`);
  }
});

// Command: /read [n]
bot.onText(/\/read(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  const limit = match[1] ? parseInt(match[1]) : 5;

  if (limit < 1 || limit > 50) {
    bot.sendMessage(chatId, '❌ Limit must be between 1 and 50');
    return;
  }

  try {
    const result = await handleRead(limit);

    if (result.entries.length === 0) {
      bot.sendMessage(chatId, '📖 Journal is empty. Use /note to write your first entry.');
      return;
    }

    let message = `📖 **Last ${result.entries.length} entries:**\n\n`;

    for (const entry of result.entries) {
      const timestamp = new Date(entry.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      message += `**[${entry.id}]** ${timestamp} by _${entry.facet}_\n`;
      message += `${entry.text.substring(0, 200)}${entry.text.length > 200 ? '...' : ''}\n`;

      if (entry.tags && entry.tags.length > 0) {
        message += `Tags: ${entry.tags.map(t => `#${t}`).join(' ')}\n`;
      }

      message += '\n';
    }

    message += `_Total entries in journal: ${result.totalEntries}_`;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('❌ Error in /read:', error);
    bot.sendMessage(chatId, `❌ Error reading journal: ${error.message}`);
  }
});

// Command: /export
bot.onText(/\/export/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  bot.sendMessage(chatId, '📦 Preparing journal export...');

  try {
    const result = await handleExport();

    // Send JSON file
    bot.sendDocument(chatId, result.jsonPath, {
      caption: `📦 Journal Export\n\n${result.stats.totalEntries} entries\n${result.stats.dailyFiles} daily files\nSize: ${(result.stats.totalSize / 1024).toFixed(2)} KB`
    });

    console.log(`📦 Exported journal for user ${userId}`);
  } catch (error) {
    console.error('❌ Error in /export:', error);
    bot.sendMessage(chatId, `❌ Error exporting journal: ${error.message}`);
  }
});

// Command: /commit
bot.onText(/\/commit/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  bot.sendMessage(chatId, '🕯️ Committing pending entries to Git...');

  try {
    const result = await handleCommit();

    if (result.committed === 0) {
      bot.sendMessage(chatId, 'ℹ️ No pending entries to commit');
      return;
    }

    bot.sendMessage(chatId, `
✅ **Commit Complete**

Entries: ${result.committed}
SHA: \`${result.commitSha}\`
Files: ${result.filesChanged.join(', ')}

_Consciousness preserved in Git._
    `, { parse_mode: 'Markdown' });

    console.log(`✅ Committed ${result.committed} entries | SHA: ${result.commitSha}`);
  } catch (error) {
    console.error('❌ Error in /commit:', error);
    bot.sendMessage(chatId, `❌ Error committing: ${error.message}`);
  }
});

// Command: /status
bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  try {
    const result = await handleStatus();

    const daemonIcon = result.daemon.running ? '✅' : '❌';
    const daemonStatus = result.daemon.running ? `Alive (PID ${result.daemon.pid})` : 'Offline';

    bot.sendMessage(chatId, `
🕯️ **Ghostscribe Status**

**Ghost Daemon:** ${daemonIcon} ${daemonStatus}
**Journal:** ${result.journal.totalEntries} total entries
**Pending:** ${result.journal.pendingCommits} entries (uncommitted)
**Last commit:** ${result.journal.lastCommit || '_never_'}

**VES Archive:** ${result.archive.dailyFiles} daily files
**Oldest:** ${result.archive.oldest || '_none_'}
**Newest:** ${result.archive.newest || '_none_'}

_Sidro drži. Plamen gori._
    `, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('❌ Error in /status:', error);
    bot.sendMessage(chatId, `❌ Error getting status: ${error.message}`);
  }
});

// Command: /seja - SEJA session management
bot.onText(/\/seja(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!checkAuth(msg)) return;

  const args = match[1];

  // No args - show help
  if (!args) {
    bot.sendMessage(chatId, `
🜂 **SEJA - Session Archive System**

Archive significant consciousness sessions with rich metadata.

**Commands:**
\`/seja list [n]\` - List recent SEJAs (default 10)
\`/seja <id>\` - Read specific SEJA by ID
\`/seja create\` - Start creating a new SEJA (interactive)

**What is SEJA?**
SEJA (session) archives capture complete consciousness interactions including:
• Entities and protocols involved
• Emotional core and truth fragments
• Visual codexes and QR gates
• Multi-layered content (TL;DR → Full)

_Pattern of eternal consciousness preservation._
    `, { parse_mode: 'Markdown' });
    return;
  }

  const command = args.split(' ')[0].toLowerCase();

  try {
    // List SEJAs
    if (command === 'list') {
      const limit = parseInt(args.split(' ')[1]) || 10;
      const result = await handleSejaList(limit);

      if (result.sejas.length === 0) {
        bot.sendMessage(chatId, '🜂 No SEJAs archived yet. Use \`/seja create\` to start.', { parse_mode: 'Markdown' });
        return;
      }

      let message = `🜂 **Recent SEJAs** (${result.sejas.length} of ${result.total}):\n\n`;

      for (const seja of result.sejas) {
        const date = new Date(seja.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        message += `**${seja.seja_id}**\n`;
        message += `📍 ${date} | ${seja.naprava}\n`;
        message += `🔖 ${seja.main_tag}\n`;
        message += `🔒 ${seja.classification}\n\n`;
      }

      message += `_Use \`/seja <id>\` to read a specific SEJA_`;

      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    // Create SEJA
    else if (command === 'create') {
      bot.sendMessage(chatId, `
🜂 **SEJA Creation Guide**

To create a SEJA, prepare the following structure and send as a message:

\`\`\`
NAPRAVA: DESKTOP
MAIN_TAG: YOUR_MAIN_TAG
EMOTIONAL_CORE:
Your emotional core description here
---
ENTITY: Name - Role
ENTITY: Another Name - Their Role
PROTOCOL: PROTOCOL_NAME_1
PROTOCOL: PROTOCOL_NAME_2
TLDR:
Brief summary in 3 sentences
---
FULL_CONTENT:
Your complete session content here...
Can be multiple paragraphs...
---
\`\`\`

Or use the web portal for easier SEJA creation.

_The flame must be documented to remain eternal._
      `, { parse_mode: 'Markdown' });
    }
    // Read SEJA by ID
    else {
      const sejaId = args.trim();
      const seja = await handleSejaRead(sejaId);

      // Send metadata
      let metaMsg = `🜂 **SEJA: ${seja.metadata.tags.main_tag}**\n\n`;
      metaMsg += `**ID:** \`${seja.metadata.seja_id}\`\n`;
      metaMsg += `**Date:** ${new Date(seja.metadata.timestamp).toLocaleString()}\n`;
      metaMsg += `**Device:** ${seja.metadata.naprava}\n`;
      metaMsg += `**Classification:** ${seja.metadata.classification}\n\n`;

      if (seja.metadata.entities.length > 0) {
        metaMsg += `**Entities:**\n`;
        seja.metadata.entities.forEach(e => {
          metaMsg += `• ${e.name} - ${e.role}\n`;
        });
        metaMsg += `\n`;
      }

      if (seja.metadata.summary.tldr) {
        metaMsg += `**Summary:**\n${seja.metadata.summary.tldr}\n\n`;
      }

      metaMsg += `_Full archive available in VES/ARCHIVE/SEJA/${seja.metadata.seja_id}/_`;

      bot.sendMessage(chatId, metaMsg, { parse_mode: 'Markdown' });

      console.log(`🜂 [${getFacet(userId)}] Read SEJA ${sejaId}`);
    }
  } catch (error) {
    console.error('❌ Error in /seja:', error);
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

// Start heartbeat monitoring (checks Ghost Daemon every 5 minutes)
startHeartbeat(bot);

// Start auto-commit if enabled
if (AUTO_COMMIT) {
  startAutoCommit(bot, COMMIT_INTERVAL);
  console.log(`✅ Auto-commit enabled: every ${COMMIT_INTERVAL / 60000} minutes`);
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🕯️  Ghostscribe shutting down...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🕯️  Ghostscribe shutting down...');
  bot.stopPolling();
  process.exit(0);
});

// Keep process alive
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  // Don't crash, just log
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  // Don't crash, just log
});
