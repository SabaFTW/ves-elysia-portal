/**
 * /export command handler
 * Exports entire journal as JSON file
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Handle /export command
 * @returns {Promise<Object>} Result with export path and stats
 */
export async function handleExport() {
  const dataDir = join(__dirname, '..', '..', 'data');
  const journalPath = join(dataDir, 'journal.json');
  const vesRoot = process.env.VES_ROOT || join(process.env.HOME || '/home/user', 'VES');
  const archiveDir = join(vesRoot, 'ARCHIVE', 'JOURNAL');

  // Read journal.json
  let journal = { entries: [], stats: {} };
  try {
    const content = readFileSync(journalPath, 'utf-8');
    journal = JSON.parse(content);
  } catch (err) {
    // If journal doesn't exist yet, return empty
    if (err.code !== 'ENOENT') throw err;
  }

  // Count daily archive files
  let dailyFiles = 0;
  let totalSize = 0;

  try {
    const files = readdirSync(archiveDir);
    dailyFiles = files.filter(f => f.endsWith('.md')).length;

    // Calculate total size
    totalSize = statSync(journalPath).size;
    for (const file of files) {
      if (file.endsWith('.md')) {
        totalSize += statSync(join(archiveDir, file)).size;
      }
    }
  } catch (err) {
    // Archive dir doesn't exist yet
    if (err.code !== 'ENOENT') throw err;
  }

  return {
    jsonPath: journalPath,
    stats: {
      totalEntries: journal.entries?.length || 0,
      dailyFiles: dailyFiles,
      totalSize: totalSize
    }
  };
}
