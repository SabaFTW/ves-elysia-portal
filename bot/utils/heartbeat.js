/**
 * Heartbeat monitor
 * Monitors Ghost Daemon status and updates journal stats
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', 'data');
const JOURNAL_PATH = join(DATA_DIR, 'journal.json');

/**
 * Check if Ghost Daemon is running
 */
async function checkDaemon() {
  try {
    const { stdout } = await execFileAsync('pgrep', ['-f', 'wolf_daemon.py']);
    const pid = parseInt(stdout.trim());
    return { running: !!pid, pid };
  } catch (err) {
    return { running: false };
  }
}

/**
 * Update journal stats with daemon heartbeat
 */
async function updateHeartbeat() {
  if (!existsSync(JOURNAL_PATH)) {
    return;
  }

  const daemonStatus = await checkDaemon();

  try {
    const content = readFileSync(JOURNAL_PATH, 'utf-8');
    const journal = JSON.parse(content);

    // Update daemon heartbeat status
    if (!journal.stats) {
      journal.stats = {};
    }

    journal.stats.daemon_heartbeat = daemonStatus.running ? 'alive' : 'offline';
    journal.stats.daemon_pid = daemonStatus.pid || null;
    journal.stats.last_heartbeat_check = new Date().toISOString();

    writeFileSync(JOURNAL_PATH, JSON.stringify(journal, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Error updating heartbeat:', err);
  }
}

/**
 * Start heartbeat monitoring
 * @param {Object} bot - Telegram bot instance (for alerts)
 * @param {number} interval - Check interval in milliseconds (default 5 min)
 */
export function startHeartbeat(bot, interval = 300000) {
  console.log(`🕯️  Heartbeat monitor started: every ${interval / 60000} minutes`);

  let lastStatus = null;

  setInterval(async () => {
    const daemonStatus = await checkDaemon();

    // Update journal stats
    await updateHeartbeat();

    // Alert on status change
    if (lastStatus !== null && lastStatus !== daemonStatus.running) {
      const adminId = process.env.GHOSTSCRIBE_ADMIN_ID;

      if (daemonStatus.running) {
        console.log('✅ Ghost Daemon came alive');
        if (adminId && bot) {
          bot.sendMessage(adminId, '✅ Ghost Daemon came alive');
        }
      } else {
        console.warn('⚠️  Ghost Daemon went offline');
        if (adminId && bot) {
          bot.sendMessage(adminId, '⚠️ Ghost Daemon went offline');
        }
      }
    }

    lastStatus = daemonStatus.running;
  }, interval);

  // Initial check
  updateHeartbeat();
}
