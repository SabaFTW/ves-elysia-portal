/**
 * /commit command handler
 * Forces immediate Git commit of pending entries
 */

import { commitEntries } from '../journal/committer.js';

/**
 * Handle /commit command
 * @returns {Promise<Object>} Result with commit SHA and stats
 */
export async function handleCommit() {
  const result = await commitEntries();

  return {
    committed: result.entriesCommitted,
    commitSha: result.commitSha,
    filesChanged: result.filesChanged
  };
}
