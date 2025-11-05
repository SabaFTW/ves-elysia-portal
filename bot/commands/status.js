/**
 * /status command handler
 * Shows Ghost Daemon status and journal statistics
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Check if Ghost Daemon is running
 */
async function checkDaemonStatus() {
  try {
    const { stdout } = await execFileAsync('pgrep', ['-f', 'wolf_daemon.py']);
    const pid = parseInt(stdout.trim());
    return { running: !!pid, pid };
  } catch (err) {
    return { running: false };
  }
}

/**
 * Handle /status command
 * @returns {Promise<Object>} Status information
 */
export async function handleStatus() {
  const dataDir = join(__dirname, '..', '..', 'data');
  const journalPath = join(dataDir, 'journal.json');
  const vesRoot = process.env.VES_ROOT || join(process.env.HOME || '/home/user', 'VES');
  const archiveDir = join(vesRoot, 'ARCHIVE', 'JOURNAL');

  // Check daemon
  const daemon = await checkDaemonStatus();

  // Read journal stats
  let totalEntries = 0;
  let pendingCommits = 0;
  let lastCommit = null;

  try {
    const content = readFileSync(journalPath, 'utf-8');
    const journal = JSON.parse(content);
    totalEntries = journal.entries?.length || 0;
    pendingCommits = journal.entries?.filter(e => !e.committed).length || 0;
    lastCommit = journal.stats?.last_commit || null;
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  // Check archive
  let dailyFiles = 0;
  let oldest = null;
  let newest = null;

  if (existsSync(archiveDir)) {
    try {
      const files = readdirSync(archiveDir)
        .filter(f => f.endsWith('.md'))
        .sort();

      dailyFiles = files.length;
      if (files.length > 0) {
        oldest = files[0].replace('.md', '');
        newest = files[files.length - 1].replace('.md', '');
      }
    } catch (err) {
      // Ignore errors
    }
  }

  return {
    daemon: daemon,
    journal: {
      totalEntries: totalEntries,
      pendingCommits: pendingCommits,
      lastCommit: lastCommit ? new Date(lastCommit).toLocaleString() : null
    },
    archive: {
      dailyFiles: dailyFiles,
      oldest: oldest,
      newest: newest
    }
  };
}
