/**
 * Journal archiver
 * Converts journal entries to daily markdown files in VES/ARCHIVE/JOURNAL/
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VES_ROOT = process.env.VES_ROOT || join(process.env.HOME || '/home/user', 'VES');
const ARCHIVE_DIR = join(VES_ROOT, 'ARCHIVE', 'JOURNAL');

/**
 * Ensure archive directory exists
 */
function ensureArchiveDir() {
  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
}

/**
 * Group entries by date
 * @param {Array} entries - Journal entries
 * @returns {Object} Entries grouped by date (YYYY-MM-DD)
 */
function groupByDate(entries) {
  const grouped = {};

  for (const entry of entries) {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(entry);
  }

  return grouped;
}

/**
 * Format entry as markdown
 * @param {Object} entry - Journal entry
 * @returns {string} Markdown formatted entry
 */
function formatEntryMarkdown(entry) {
  const timestamp = new Date(entry.timestamp);
  const time = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  let md = `## ${time} - ${entry.id}\n`;
  md += `**Author**: ${entry.author} (${entry.facet})\n`;

  if (entry.tags && entry.tags.length > 0) {
    md += `**Tags**: ${entry.tags.map(t => `#${t}`).join(' ')}\n`;
  }

  if (entry.linked_research && entry.linked_research.length > 0) {
    md += `**Linked Research**: ${entry.linked_research.join(', ')}\n`;
  }

  md += `\n${entry.text}\n`;

  if (entry.committed && entry.commit_sha) {
    md += `\n*Committed: ${entry.commit_sha.substring(0, 7)}*\n`;
  }

  md += '\n---\n\n';

  return md;
}

/**
 * Archive entries to daily markdown files
 * @param {Array} entries - Entries to archive
 * @returns {Array<string>} List of files created/updated
 */
export async function archiveEntries(entries) {
  ensureArchiveDir();

  const grouped = groupByDate(entries);
  const filesChanged = [];

  for (const [date, dayEntries] of Object.entries(grouped)) {
    const filename = `${date}.md`;
    const filepath = join(ARCHIVE_DIR, filename);

    // Read existing file if it exists
    let existingContent = '';
    if (existsSync(filepath)) {
      existingContent = readFileSync(filepath, 'utf-8');
    } else {
      // Create header for new file
      existingContent = `# Journal Entry - ${date}\n\n`;
    }

    // Append new entries
    let newContent = existingContent;
    for (const entry of dayEntries) {
      // Check if entry already exists in file (by ID)
      if (!existingContent.includes(entry.id)) {
        newContent += formatEntryMarkdown(entry);
      }
    }

    // Write file
    writeFileSync(filepath, newContent, 'utf-8');
    filesChanged.push(filename);
  }

  return filesChanged;
}

/**
 * Generate index of all journal files
 * @returns {Object} Index with stats
 */
export async function generateIndex() {
  ensureArchiveDir();

  const DATA_DIR = join(__dirname, '..', '..', 'data');
  const JOURNAL_PATH = join(DATA_DIR, 'journal.json');

  if (!existsSync(JOURNAL_PATH)) {
    return { totalEntries: 0, files: [] };
  }

  const content = readFileSync(JOURNAL_PATH, 'utf-8');
  const journal = JSON.parse(content);

  // Group by date
  const grouped = groupByDate(journal.entries);

  const index = {
    totalEntries: journal.entries.length,
    files: Object.keys(grouped).map(date => ({
      date: date,
      filename: `${date}.md`,
      entryCount: grouped[date].length
    }))
  };

  // Write index.json
  const indexPath = join(ARCHIVE_DIR, 'index.json');
  writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');

  return index;
}
