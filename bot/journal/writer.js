/**
 * Journal writer
 * Writes entries to journal.json with auto-incrementing IDs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', 'data');
const JOURNAL_PATH = join(DATA_DIR, 'journal.json');

/**
 * Load journal from disk
 */
function loadJournal() {
  if (!existsSync(JOURNAL_PATH)) {
    return {
      entries: [],
      stats: {
        total_entries: 0,
        last_commit: null,
        daemon_heartbeat: 'unknown'
      }
    };
  }

  const content = readFileSync(JOURNAL_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save journal to disk
 */
function saveJournal(journal) {
  writeFileSync(JOURNAL_PATH, JSON.stringify(journal, null, 2), 'utf-8');
}

/**
 * Generate next entry ID
 */
function generateId(journal) {
  if (journal.entries.length === 0) {
    return 'j001';
  }

  // Get last ID and increment
  const lastId = journal.entries[journal.entries.length - 1].id;
  const num = parseInt(lastId.substring(1)) + 1;
  return `j${num.toString().padStart(3, '0')}`;
}

/**
 * Write new entry to journal
 * @param {Object} entry - Entry object (without ID)
 * @returns {Object} Result with entry ID and total count
 */
export async function writeEntry(entry) {
  const journal = loadJournal();

  // Generate ID
  const id = generateId(journal);

  // Add ID to entry
  const fullEntry = {
    id: id,
    ...entry
  };

  // Append to entries
  journal.entries.push(fullEntry);

  // Update stats
  journal.stats.total_entries = journal.entries.length;

  // Save to disk
  saveJournal(journal);

  return {
    id: id,
    totalEntries: journal.entries.length
  };
}

/**
 * Mark entries as committed
 * @param {Array<string>} entryIds - Array of entry IDs to mark
 * @param {string} commitSha - Git commit SHA
 */
export async function markCommitted(entryIds, commitSha) {
  const journal = loadJournal();

  for (const entryId of entryIds) {
    const entry = journal.entries.find(e => e.id === entryId);
    if (entry) {
      entry.committed = true;
      entry.commit_sha = commitSha;
    }
  }

  // Update last commit timestamp
  journal.stats.last_commit = new Date().toISOString();

  saveJournal(journal);
}

/**
 * Get pending (uncommitted) entries
 */
export function getPendingEntries() {
  const journal = loadJournal();
  return journal.entries.filter(e => !e.committed);
}
