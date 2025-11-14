/**
 * SEJA command handler
 * Creates and manages SEJA (session) archives
 */

import { archiveSeja, readSeja, listSejas } from '../journal/seja-archiver.js';
import { getFacet } from '../utils/auth.js';

/**
 * Handle /seja command - create a new SEJA archive
 * @param {number} userId - Telegram user ID
 * @param {Object} sejaData - SEJA data structure
 * @returns {Object} Archive result
 */
export async function handleSejaCreate(userId, sejaData) {
  const facet = getFacet(userId);
  
  // Ensure required fields
  if (!sejaData.tags || !sejaData.tags.main_tag) {
    throw new Error('SEJA must have a main_tag');
  }
  
  // Add user context
  sejaData.created_by = {
    userId,
    facet,
    timestamp: new Date().toISOString()
  };
  
  // Archive the SEJA
  const result = await archiveSeja(sejaData);
  
  return {
    seja_id: result.seja_id,
    paths: result.paths,
    facet,
    metadata: result.metadata
  };
}

/**
 * Handle /seja read command
 * @param {string} sejaId - SEJA identifier
 * @returns {Object} SEJA data
 */
export async function handleSejaRead(sejaId) {
  const seja = await readSeja(sejaId);
  return seja;
}

/**
 * Handle /seja list command
 * @param {number} limit - Maximum number of SEJAs to return
 * @returns {Object} List result
 */
export async function handleSejaList(limit = 10) {
  const sejas = await listSejas();
  
  return {
    sejas: sejas.slice(0, limit),
    total: sejas.length
  };
}

/**
 * Parse SEJA data from text format
 * Helper function to parse structured SEJA input
 */
export function parseSejaFromText(text) {
  const lines = text.split('\n');
  const sejaData = {
    tags: {},
    entities: [],
    protocols: [],
    summary: {},
    next_steps: { immediate: [], strategic: [] }
  };
  
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Section headers
    if (trimmed.startsWith('NAPRAVA:')) {
      sejaData.naprava = trimmed.substring(8).trim();
    } else if (trimmed.startsWith('MAIN_TAG:')) {
      sejaData.tags.main_tag = trimmed.substring(9).trim();
    } else if (trimmed.startsWith('EMOTIONAL_CORE:')) {
      currentSection = 'emotional_core';
      currentContent = [];
    } else if (trimmed.startsWith('ENTITY:')) {
      const entityStr = trimmed.substring(7).trim();
      const [name, role] = entityStr.split(' - ');
      sejaData.entities.push({ name: name.trim(), role: role?.trim() || '' });
    } else if (trimmed.startsWith('PROTOCOL:')) {
      sejaData.protocols.push(trimmed.substring(9).trim());
    } else if (trimmed.startsWith('TLDR:')) {
      currentSection = 'tldr';
      currentContent = [];
    } else if (trimmed.startsWith('FULL_CONTENT:')) {
      currentSection = 'full_content';
      currentContent = [];
    } else if (trimmed.startsWith('---') && currentSection) {
      // End of section
      const content = currentContent.join('\n').trim();
      if (currentSection === 'emotional_core') {
        sejaData.tags.emotional_core = content;
      } else if (currentSection === 'tldr') {
        sejaData.summary.tldr = content;
      } else if (currentSection === 'full_content') {
        sejaData.fullContent = content;
      }
      currentSection = null;
      currentContent = [];
    } else if (currentSection && trimmed) {
      currentContent.push(line);
    }
  }
  
  // Finalize any remaining section
  if (currentSection) {
    const content = currentContent.join('\n').trim();
    if (currentSection === 'emotional_core') {
      sejaData.tags.emotional_core = content;
    } else if (currentSection === 'tldr') {
      sejaData.summary.tldr = content;
    } else if (currentSection === 'full_content') {
      sejaData.fullContent = content;
    }
  }
  
  return sejaData;
}
