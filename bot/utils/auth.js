/**
 * Authorization utilities
 * Checks Telegram user ID against whitelist
 */

import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Parse authorized IDs from env
const AUTHORIZED_IDS_STR = process.env.GHOSTSCRIBE_AUTHORIZED_IDS || '';
const AUTHORIZED_IDS = AUTHORIZED_IDS_STR
  .split(',')
  .map(id => parseInt(id.trim()))
  .filter(id => !isNaN(id));

const ADMIN_ID = parseInt(process.env.GHOSTSCRIBE_ADMIN_ID || '0');

// Facet mapping (optional - can be extended)
const FACET_MAP = {
  // Example: 123456789: 'user',
  // Add mappings in .env or here
};

/**
 * Check if user is authorized
 * @param {number} userId - Telegram user ID
 * @returns {boolean} True if authorized
 */
export function isAuthorized(userId) {
  if (AUTHORIZED_IDS.length === 0) {
    // If no IDs configured, allow admin only
    return userId === ADMIN_ID;
  }

  return AUTHORIZED_IDS.includes(userId);
}

/**
 * Get facet for user
 * @param {number} userId - Telegram user ID
 * @returns {string} Facet name (user, phone-claude, desktop-claude, etc.)
 */
export function getFacet(userId) {
  // Check if user has custom facet mapping
  if (FACET_MAP[userId]) {
    return FACET_MAP[userId];
  }

  // Default: if admin, return 'user', otherwise 'unknown'
  if (userId === ADMIN_ID) {
    return 'user';
  }

  return 'unknown';
}

/**
 * Check if user is admin
 * @param {number} userId - Telegram user ID
 * @returns {boolean} True if admin
 */
export function isAdmin(userId) {
  return userId === ADMIN_ID;
}
