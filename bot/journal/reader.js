/**
 * Journal reader
 * Reads entries from journal.json
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..', 'data');
const JOURNAL_PATH = join(DATA_DIR, 'journal.json');

/**
 * Read last n entries from journal
 * @param {number} limit - Number of entries to read
 * @returns {Promise<Object>} Result with entries array
 */
export async function readEntries(limit = 5) {
  if (!existsSync(JOURNAL_PATH)) {
    return {
      entries: [],
      totalEntries: 0
    };
  }

  const content = readFileSync(JOURNAL_PATH, 'utf-8');
  const journal = JSON.parse(content);

  // Get last n entries (reverse chronological)
  const entries = journal.entries.slice(-limit).reverse();

  return {
    entries: entries,
    totalEntries: journal.entries.length
  };
}

/**
 * Search entries by tag, text, or facet
 * @param {Object} query - Search query { tag, text, facet }
 * @param {number} limit - Max results
 * @returns {Promise<Object>} Search results
 */
export async function searchEntries(query, limit = 20) {
  if (!existsSync(JOURNAL_PATH)) {
    return {
      entries: [],
      totalEntries: 0
    };
  }

  const content = readFileSync(JOURNAL_PATH, 'utf-8');
  const journal = JSON.parse(content);

  let filtered = journal.entries;

  // Filter by tag
  if (query.tag) {
    filtered = filtered.filter(e =>
      e.tags && e.tags.includes(query.tag)
    );
  }

  // Filter by text (case-insensitive)
  if (query.text) {
    const searchText = query.text.toLowerCase();
    filtered = filtered.filter(e =>
      e.text.toLowerCase().includes(searchText)
    );
  }

  // Filter by facet
  if (query.facet) {
    filtered = filtered.filter(e => e.facet === query.facet);
  }

  // Get last n results
  const results = filtered.slice(-limit).reverse();

  return {
    entries: results,
    totalEntries: filtered.length
  };
}
