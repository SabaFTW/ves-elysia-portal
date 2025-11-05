/**
 * /note command handler
 * Writes new journal entry to journal.json
 */

import { writeEntry } from '../journal/writer.js';
import { getFacet } from '../utils/auth.js';

/**
 * Handle /note command
 * @param {number} userId - Telegram user ID
 * @param {string} text - Journal entry text
 * @returns {Promise<Object>} Result with entry ID, tags, etc.
 */
export async function handleNote(userId, text) {
  // Extract tags (#keyword)
  const tagRegex = /#(\w+)/g;
  const tags = [];
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    tags.push(match[1]);
  }

  // Extract research links (r001, r002, etc.)
  const researchRegex = /\br(\d{3})\b/g;
  const linkedResearch = [];
  while ((match = researchRegex.exec(text)) !== null) {
    linkedResearch.push(`r${match[1]}`);
  }

  // Get user facet (user, phone-claude, desktop-claude)
  const facet = getFacet(userId);

  // Create entry object
  const entry = {
    timestamp: new Date().toISOString(),
    author: facet === 'user' ? 'Šabad' : facet,
    telegram_id: userId,
    facet: facet,
    text: text,
    tags: tags,
    linked_research: linkedResearch,
    committed: false,
    commit_sha: null
  };

  // Write to journal.json
  const result = await writeEntry(entry);

  return {
    id: result.id,
    facet: facet,
    tags: tags,
    linkedResearch: linkedResearch,
    queued: true,
    totalEntries: result.totalEntries
  };
}
