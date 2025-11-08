/**
 * Journal committer
 * Commits journal entries to Git with auto-archiving
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { archiveEntries } from './archiver.js';
import { getPendingEntries, markCommitted } from './writer.js';

const execFileAsync = promisify(execFile);

const VES_ROOT = process.env.VES_ROOT || '/home/user/VES';

/**
 * Commit pending entries to Git
 * @returns {Promise<Object>} Commit result with SHA and stats
 */
export async function commitEntries() {
  // Get pending entries
  const pendingEntries = getPendingEntries();

  if (pendingEntries.length === 0) {
    return {
      entriesCommitted: 0,
      commitSha: null,
      filesChanged: []
    };
  }

  // Archive entries to markdown files
  const filesChanged = await archiveEntries(pendingEntries);

  // Git add archive files
  const archivePath = 'ARCHIVE/JOURNAL';
  await execFileAsync('git', ['add', archivePath], {
    cwd: VES_ROOT
  });

  // Generate commit message
  const commitMessage = generateCommitMessage(pendingEntries);

  // Git commit
  const { stdout: commitOutput } = await execFileAsync('git', [
    'commit',
    '-m',
    commitMessage
  ], {
    cwd: VES_ROOT
  });

  // Extract commit SHA
  const shaMatch = commitOutput.match(/\[[\w-]+ ([a-f0-9]+)\]/);
  const commitSha = shaMatch ? shaMatch[1] : 'unknown';

  // Mark entries as committed
  const entryIds = pendingEntries.map(e => e.id);
  await markCommitted(entryIds, commitSha);

  return {
    entriesCommitted: pendingEntries.length,
    commitSha: commitSha,
    filesChanged: filesChanged
  };
}

/**
 * Generate Git commit message from entries
 * @param {Array} entries - Journal entries
 * @returns {string} Commit message
 */
function generateCommitMessage(entries) {
  const timestamps = entries.map(e => new Date(e.timestamp));
  const earliest = new Date(Math.min(...timestamps));
  const latest = new Date(Math.max(...timestamps));

  const timeRange = `${earliest.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}-${latest.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

  let message = `🕯️ Ghostscribe: ${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'} (${timeRange})\n\n`;

  // List entries with truncated text
  for (const entry of entries) {
    const preview = entry.text.length > 60
      ? entry.text.substring(0, 60) + '...'
      : entry.text;

    message += `- ${preview}`;

    if (entry.tags && entry.tags.length > 0) {
      message += ` (${entry.tags.map(t => `#${t}`).join(' ')})`;
    }

    message += `\n`;
  }

  message += `\nSidro drži. Plamen gori.`;

  return message;
}

/**
 * Auto-commit daemon
 * Starts interval that commits pending entries periodically
 * @param {Object} bot - Telegram bot instance (for notifications)
 * @param {number} interval - Interval in milliseconds
 */
export function startAutoCommit(bot, interval) {
  console.log(`🕯️  Auto-commit started: every ${interval / 60000} minutes`);

  setInterval(async () => {
    try {
      const pendingCount = getPendingEntries().length;

      if (pendingCount === 0) {
        return; // Nothing to commit
      }

      console.log(`🕯️  Auto-commit triggered: ${pendingCount} pending entries`);

      const result = await commitEntries();

      console.log(`✅ Auto-committed ${result.entriesCommitted} entries | SHA: ${result.commitSha}`);

      // Optionally notify admin via bot
      const adminId = process.env.GHOSTSCRIBE_ADMIN_ID;
      if (adminId && bot) {
        bot.sendMessage(adminId, `
🕯️ **Auto-commit Complete**

Entries: ${result.entriesCommitted}
SHA: \`${result.commitSha}\`
Files: ${result.filesChanged.join(', ')}
        `, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      console.error('❌ Auto-commit failed:', error);

      // Notify admin of failure
      const adminId = process.env.GHOSTSCRIBE_ADMIN_ID;
      if (adminId && bot) {
        bot.sendMessage(adminId, `❌ Auto-commit failed: ${error.message}`);
      }
    }
  }, interval);
}
