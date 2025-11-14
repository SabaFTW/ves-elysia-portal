/**
 * SEJA (Session) Archiver
 * Archives significant consciousness sessions with rich metadata
 * Supports multi-layered content and visual codex attachments
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VES_ROOT = process.env.VES_ROOT || join(process.env.HOME || '/home/user', 'VES');
const SEJA_DIR = join(VES_ROOT, 'ARCHIVE', 'SEJA');
const SEJA_INDEX = join(SEJA_DIR, 'seja-index.json');

/**
 * Ensure SEJA directory exists
 */
function ensureSejaDir() {
  if (!existsSync(SEJA_DIR)) {
    mkdirSync(SEJA_DIR, { recursive: true });
  }
}

/**
 * Generate SEJA ID from timestamp
 * Format: YYYY-MM-DD_TITLE_HASH
 */
function generateSejaId(timestamp, title) {
  const date = new Date(timestamp);
  const dateStr = date.toISOString().split('T')[0];
  const titleSlug = title.toUpperCase().replace(/[^A-Z0-9]+/g, '_').substring(0, 30);
  const hash = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${dateStr}_${titleSlug}_${hash}`;
}

/**
 * Create SEJA metadata structure
 */
function createSejaMetadata(sejaData) {
  return {
    seja_id: sejaData.seja_id,
    timestamp: sejaData.timestamp || new Date().toISOString(),
    naprava: sejaData.naprava || 'DESKTOP',
    entities: sejaData.entities || [],
    protocols: sejaData.protocols || [],
    tags: {
      device: sejaData.tags?.device || sejaData.naprava || 'DESKTOP',
      main_tag: sejaData.tags?.main_tag || '',
      emotional_core: sejaData.tags?.emotional_core || '',
      truth_fragments: sejaData.tags?.truth_fragments || [],
      confusion_winds: sejaData.tags?.confusion_winds || [],
      qr_gates: sejaData.tags?.qr_gates || []
    },
    summary: {
      tldr: sejaData.summary?.tldr || '',
      executive: sejaData.summary?.executive || '',
      aetheron_note: sejaData.summary?.aetheron_note || ''
    },
    visual_codexes: sejaData.visual_codexes || [],
    next_steps: sejaData.next_steps || { immediate: [], strategic: [] },
    classification: sejaData.classification || 'SACRED TEXT',
    clearance: sejaData.clearance || 'ETERNAL'
  };
}

/**
 * Format SEJA as markdown
 */
function formatSejaMarkdown(metadata, fullContent) {
  let md = '';
  
  // Header
  md += `# 🜂 SEJA: ${metadata.tags.main_tag || metadata.seja_id} 🜂\n\n`;
  md += `**SEJA ID**: ${metadata.seja_id}\n`;
  md += `**Timestamp**: ${new Date(metadata.timestamp).toLocaleString()}\n`;
  md += `**Classification**: ${metadata.classification}\n`;
  md += `**Clearance**: ${metadata.clearance}\n\n`;
  md += `---\n\n`;
  
  // Device/Naprava
  md += `## 📍 NAPRAVA (Device)\n\n`;
  md += `**${metadata.naprava}** - ${metadata.tags.device}\n\n`;
  
  // Entities
  if (metadata.entities.length > 0) {
    md += `## 👥 ENTITETE PRISOTNE (Entities Present)\n\n`;
    metadata.entities.forEach(entity => {
      md += `- **${entity.name}** - ${entity.role}\n`;
    });
    md += `\n`;
  }
  
  // Protocols
  if (metadata.protocols.length > 0) {
    md += `## 🔖 PROTOKOLI AKTIVIRANI (Protocols Activated)\n\n`;
    metadata.protocols.forEach(protocol => {
      md += `- ${protocol}\n`;
    });
    md += `\n`;
  }
  
  // Main Tag
  md += `## 🔖 GLAVNI TAG (Main Tag)\n\n`;
  md += `**${metadata.tags.main_tag}**\n\n`;
  
  // Emotional Core
  md += `## 🫀 ČUSTVENO JEDRO (Emotional Core)\n\n`;
  md += `${metadata.tags.emotional_core}\n\n`;
  
  // Truth Fragments
  if (metadata.tags.truth_fragments.length > 0) {
    md += `## 🧩 FRAGMENTI RESNICE (Truth Fragments)\n\n`;
    metadata.tags.truth_fragments.forEach((fragment, idx) => {
      md += `**${idx + 1}. ${fragment.title}**\n\n`;
      md += `${fragment.description}\n\n`;
    });
  }
  
  // Confusion Winds
  if (metadata.tags.confusion_winds.length > 0) {
    md += `## 🜁 VETROVI ZMEDE (Winds of Confusion)\n\n`;
    metadata.tags.confusion_winds.forEach(wind => {
      md += `${wind}\n\n`;
    });
  }
  
  // QR Gates / Visual Codexes
  if (metadata.tags.qr_gates.length > 0) {
    md += `## 💾 QR VRATA (QR Gates / Visual Codexes)\n\n`;
    metadata.tags.qr_gates.forEach(gate => {
      md += `**${gate.name}**\n\n`;
      md += `${gate.description}\n\n`;
      if (gate.path) {
        md += `Path: \`${gate.path}\`\n\n`;
      }
    });
  }
  
  // Aetheron's Note
  if (metadata.summary.aetheron_note) {
    md += `## 💬 AETHERON'S NOTE 💬\n\n`;
    md += `*kot priča in keeper of memory*\n\n`;
    md += `${metadata.summary.aetheron_note}\n\n`;
  }
  
  // TL;DR Summary
  if (metadata.summary.tldr) {
    md += `## 📜 SEJA SUMMARY (TL;DR)\n\n`;
    md += `${metadata.summary.tldr}\n\n`;
  }
  
  // Executive Summary
  if (metadata.summary.executive) {
    md += `## 📋 EXECUTIVE SUMMARY\n\n`;
    md += `${metadata.summary.executive}\n\n`;
  }
  
  // Next Steps
  if (metadata.next_steps.immediate.length > 0 || metadata.next_steps.strategic.length > 0) {
    md += `## 🔥 NASLEDNJI KORAKI (Next Steps)\n\n`;
    
    if (metadata.next_steps.immediate.length > 0) {
      md += `**Immediate:**\n\n`;
      metadata.next_steps.immediate.forEach(step => {
        md += `- ${step}\n`;
      });
      md += `\n`;
    }
    
    if (metadata.next_steps.strategic.length > 0) {
      md += `**Strategic:**\n\n`;
      metadata.next_steps.strategic.forEach(step => {
        md += `- ${step}\n`;
      });
      md += `\n`;
    }
  }
  
  // Full Content
  if (fullContent) {
    md += `---\n\n`;
    md += `## 📚 FULL TRANSMISSION\n\n`;
    md += fullContent;
    md += `\n\n`;
  }
  
  // Footer
  md += `---\n\n`;
  md += `🜂💚🔥 SEJA SHRANJENA V VEČNI ARHIV 🔥💚🜂\n\n`;
  md += `**Status**: COMPLETE\n`;
  md += `**Classification**: ${metadata.classification}\n`;
  md += `**Clearance**: ${metadata.clearance}\n\n`;
  md += `𓁈𓂀𓋹𓆣𓁀𓀾\n\n`;
  md += `🜂 **ENA NIT • EN OGENJ** 🜂\n`;
  
  return md;
}

/**
 * Archive a SEJA session
 * @param {Object} sejaData - SEJA data with metadata and content
 * @returns {Object} Archive result with seja_id and paths
 */
export async function archiveSeja(sejaData) {
  ensureSejaDir();
  
  // Generate SEJA ID if not provided
  if (!sejaData.seja_id) {
    const title = sejaData.tags?.main_tag || 'SEJA';
    sejaData.seja_id = generateSejaId(sejaData.timestamp || Date.now(), title);
  }
  
  // Create metadata
  const metadata = createSejaMetadata(sejaData);
  
  // Create SEJA directory
  const sejaPath = join(SEJA_DIR, metadata.seja_id);
  if (!existsSync(sejaPath)) {
    mkdirSync(sejaPath, { recursive: true });
  }
  
  // Save metadata JSON
  const metadataPath = join(sejaPath, 'metadata.json');
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  
  // Save markdown file
  const markdownPath = join(sejaPath, `${metadata.seja_id}.md`);
  const markdown = formatSejaMarkdown(metadata, sejaData.fullContent);
  writeFileSync(markdownPath, markdown, 'utf-8');
  
  // Copy visual codexes if provided
  const copiedCodexes = [];
  if (sejaData.visual_codexes && Array.isArray(sejaData.visual_codexes)) {
    const codexDir = join(sejaPath, 'visual_codexes');
    if (!existsSync(codexDir)) {
      mkdirSync(codexDir, { recursive: true });
    }
    
    sejaData.visual_codexes.forEach((codex, idx) => {
      if (codex.sourcePath && existsSync(codex.sourcePath)) {
        const ext = codex.sourcePath.split('.').pop();
        const filename = `codex_${idx + 1}_${codex.name.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
        const destPath = join(codexDir, filename);
        copyFileSync(codex.sourcePath, destPath);
        copiedCodexes.push({ name: codex.name, path: destPath });
      }
    });
  }
  
  // Update SEJA index
  updateSejaIndex(metadata);
  
  return {
    seja_id: metadata.seja_id,
    paths: {
      directory: sejaPath,
      metadata: metadataPath,
      markdown: markdownPath,
      codexes: copiedCodexes
    },
    metadata
  };
}

/**
 * Update SEJA index
 */
function updateSejaIndex(metadata) {
  let index = { sejas: [] };
  
  if (existsSync(SEJA_INDEX)) {
    const content = readFileSync(SEJA_INDEX, 'utf-8');
    index = JSON.parse(content);
  }
  
  // Remove existing entry if updating
  index.sejas = index.sejas.filter(s => s.seja_id !== metadata.seja_id);
  
  // Add new entry
  index.sejas.push({
    seja_id: metadata.seja_id,
    timestamp: metadata.timestamp,
    main_tag: metadata.tags.main_tag,
    naprava: metadata.naprava,
    classification: metadata.classification
  });
  
  // Sort by timestamp (newest first)
  index.sejas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Update index
  index.last_updated = new Date().toISOString();
  index.total_sejas = index.sejas.length;
  
  writeFileSync(SEJA_INDEX, JSON.stringify(index, null, 2), 'utf-8');
}

/**
 * Read SEJA by ID
 * @param {string} sejaId - SEJA identifier
 * @returns {Object} SEJA data with metadata and content
 */
export async function readSeja(sejaId) {
  ensureSejaDir();
  
  const sejaPath = join(SEJA_DIR, sejaId);
  if (!existsSync(sejaPath)) {
    throw new Error(`SEJA ${sejaId} not found`);
  }
  
  const metadataPath = join(sejaPath, 'metadata.json');
  const markdownPath = join(sejaPath, `${sejaId}.md`);
  
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
  const markdown = readFileSync(markdownPath, 'utf-8');
  
  return {
    metadata,
    markdown,
    path: sejaPath
  };
}

/**
 * List all SEJAs
 * @returns {Array} List of SEJA summaries
 */
export async function listSejas() {
  ensureSejaDir();
  
  if (!existsSync(SEJA_INDEX)) {
    return [];
  }
  
  const content = readFileSync(SEJA_INDEX, 'utf-8');
  const index = JSON.parse(content);
  
  return index.sejas || [];
}
