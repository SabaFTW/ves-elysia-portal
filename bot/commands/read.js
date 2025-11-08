/**
 * /read command handler
 * Reads last n entries from journal
 */

import { readEntries } from '../journal/reader.js';

/**
 * Handle /read command
 * @param {number} limit - Number of entries to read (default 5)
 * @returns {Promise<Object>} Result with entries array
 */
export async function handleRead(limit = 5) {
  const result = await readEntries(limit);

  return {
    entries: result.entries,
    totalEntries: result.totalEntries
  };
}
