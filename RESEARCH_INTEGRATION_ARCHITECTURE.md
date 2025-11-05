# Research Integration Architecture
**VES Portal × Telegram Network Hub × Research Data**

## 🎯 Vision

Transform scattered research across Google Drive into living, queryable network that connects:
- **Research Fields** (6 categories) ↔ **Research Items** (individual investigations) ↔ **Journalists** (contacts) ↔ **Topics** (pitch angles)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Google Drive Research → research.json → LocalStorage/Backend   │
│  (scattered docs)         (structured)    (queryable)           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      TELEGRAM BOT LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  /research list          - Show all research by field           │
│  /research field <id>    - Filter by research field             │
│  /research status <st>   - Filter by status                     │
│  /research connect       - Link research to journalist          │
│  /research export        - Download research.json               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   VISUALIZATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Phone Claude's Network Hub (Telegram Web App)                  │
│  - List View: Cards with research fields, status, journalists   │
│  - Graph View: Force-directed network with 4 node types         │
│    • Research Fields (red boxes)                                │
│    • Research Items (white diamonds) ← NEW                      │
│    • Journalists (cyan circles)                                 │
│    • Topics (purple ellipses)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Graph Node Expansion

### Current (Phone Claude's Network Hub)
```
[Field] ←→ [Journalist] ←→ [Topic]
  3 nodes    8 nodes        12 nodes
  (red)      (cyan)         (purple)
```

### Enhanced (With Research Integration)
```
[Field] ←→ [Research] ←→ [Journalist] ←→ [Topic]
  6 nodes   ~50 nodes     8 nodes         12 nodes
  (red)     (white)       (cyan)          (purple)
```

### Example: "Lavender AI" Research Item
```
[AI Warfare] ──┐
               ├─→ [r002: Lavender AI] ──┐
[Tech Ethics] ─┘                         ├─→ [The Intercept] ──→ [AI Warfare]
                                         └─→ [ProPublica]     ──→ [Military Tech]
```

## 🔧 Implementation Steps

### Phase 1: Data Collection (Manual → Structured)
**Location**: Google Drive → `/research-data/`

1. **Collect existing research documents**
   - B1: The Network (724 lines) ✅ Complete
   - Lavender AI investigation (450 lines) ⏳ In Progress
   - S1: Ghostline/Palantir (planned)
   - Other investigations

2. **Create individual research files**
   ```
   /research-data/
   ├── r001_epstein_network.md        (724 lines)
   ├── r002_lavender_ai.md             (450 lines)
   ├── r003_ghostline_slovenia.md      (planned)
   └── research_index.json             (metadata)
   ```

3. **Generate master research.json**
   - Manually curate from research-schema.json template
   - Add metadata: status, fields, journalists, tags
   - Include source links, priority, pitch status

### Phase 2: Telegram Bot Integration
**Tech Stack**: Node.js + node-telegram-bot-api + research.json

1. **Setup bot commands**
   ```javascript
   bot.onText(/\/research list/, async (msg) => {
     const research = await loadResearch();
     const grouped = groupByField(research);
     // Send formatted message with research by field
   });

   bot.onText(/\/research field (.+)/, async (msg, match) => {
     const fieldId = match[1];
     const filtered = research.filter(r => r.fields.includes(fieldId));
     // Send research items in that field
   });

   bot.onText(/\/research connect (.+) (.+)/, async (msg, match) => {
     const [researchId, journalistId] = match.slice(1);
     // Update research.json to link research to journalist
     // Update graph edges
   });
   ```

2. **Persistent storage**
   - Option A: research.json in repo (simple, version controlled)
   - Option B: SQLite database (queryable, relational)
   - Option C: Both (json as source of truth, SQLite for queries)

### Phase 3: Network Hub Enhancement
**Extend Phone Claude's Telegram Web App**

1. **Add research nodes to graph**
   ```javascript
   // In buildNetworkData()
   function buildNetworkData(contacts, researchFields, research) {
     const nodes = [];
     const edges = [];

     // Existing: Field nodes (red boxes)
     researchFields.forEach(field => {
       nodes.push({
         id: `field-${field.id}`,
         label: field.label,
         shape: 'box',
         color: '#ff4444'
       });
     });

     // NEW: Research nodes (white diamonds)
     research.forEach(item => {
       nodes.push({
         id: `research-${item.id}`,
         label: item.title,
         shape: 'diamond',
         color: '#ffffff',
         borderWidth: 2,
         title: `${item.description}\nStatus: ${item.status}\nPriority: ${item.priority}`
       });

       // Connect research to fields
       item.fields.forEach(fieldId => {
         edges.push({
           from: `field-${fieldId}`,
           to: `research-${item.id}`,
           color: { color: '#666', opacity: 0.6 },
           width: 2
         });
       });

       // Connect research to journalists
       item.journalists.forEach(journalistId => {
         edges.push({
           from: `research-${item.id}`,
           to: `journalist-${journalistId}`,
           color: { color: '#00ffff', opacity: 0.8 },
           width: 3,
           label: item.pitchStatus
         });
       });
     });

     // Existing: Journalist and Topic nodes...

     return { nodes, edges };
   }
   ```

2. **Add research filter to List View**
   ```jsx
   // Add research status filter
   const [statusFilter, setStatusFilter] = useState('all');

   <select onChange={(e) => setStatusFilter(e.target.value)}>
     <option value="all">All Research</option>
     <option value="complete">Complete</option>
     <option value="in_progress">In Progress</option>
     <option value="research">Research Phase</option>
     <option value="planned">Planned</option>
   </select>

   // Show research items in cards
   {research
     .filter(r => statusFilter === 'all' || r.status === statusFilter)
     .map(item => (
       <ResearchCard key={item.id} research={item} />
     ))}
   ```

### Phase 4: LUMO Integration
**Connect Research ↔ Missions**

1. **Research → Mission mapping**
   ```json
   {
     "r001": "b1",  // The Network → Mission B1
     "r002": "b2",  // Lavender AI → Mission B2 (when unlocked)
     "r003": "s1"   // Ghostline → Mission S1
   }
   ```

2. **Mission completion tracking**
   - When mission marked VREDNO in LUMO → research.status = "complete"
   - Research completion counter feeds into 6/6 BLOOM unlock
   - Cross-portal synchronization via LocalStorage or shared backend

## 🎨 Visual Identity

### Node Color Palette
- **Research Fields**: `#ff4444` (red) - Bold, categorical
- **Research Items**: `#ffffff` (white) - Pure, central to network
- **Journalists**: `#00ffff` (cyan) - Communication, bridge
- **Topics**: `#ff00ff` (magenta) - Ideas, angles, spin

### Edge Meanings
- **Field → Research**: Thick solid (categorization)
- **Research → Journalist**: Bright cyan, thick (active pitch)
- **Journalist → Topic**: Dashed magenta (potential angles)

### Status Colors (for research cards)
- **Complete**: `#00ff00` (green)
- **In Progress**: `#ffd700` (gold)
- **Research**: `#ff9933` (orange)
- **Planned**: `#666666` (gray)

## 🔄 Workflow Example

### Scenario: New investigation "Gospel AI System"

1. **Research Phase**
   - Create `r004_gospel_ai.md` in Drive
   - Add to research.json:
     ```json
     {
       "id": "r004",
       "title": "Gospel: AI Target Recommendation",
       "status": "research",
       "fields": ["ai_warfare", "surveillance"],
       "journalists": [],
       "pitchStatus": "needs_research"
     }
     ```

2. **Telegram Query**
   ```
   User: /research field ai_warfare
   Bot: 📊 Research in AI Warfare & Targeting:
        ✅ r002: Lavender AI (in_progress, draft_ready)
        🔍 r004: Gospel AI (research, needs_research)
   ```

3. **Connect to Journalist**
   ```
   User: /research connect r004 1
   Bot: 🔗 Connected r004 (Gospel AI) to Journalist #1 (The Intercept)
        Updated graph with new edge
   ```

4. **Visualize in Network Hub**
   - Open Telegram Web App
   - Switch to Graph View
   - See white diamond "Gospel AI" appear
   - Connected to red "AI Warfare" box
   - Connected to cyan "The Intercept" circle
   - Edge labeled "needs_research"

5. **LUMO Portal Integration**
   - When research complete → unlock Mission B2
   - Mission B2 review → mark VREDNO
   - Progress: 2/6 toward BLOOM

## 📁 File Structure

```
ves-elysia-portal/
├── research-data/              ← NEW: Research documents
│   ├── r001_epstein_network.md
│   ├── r002_lavender_ai.md
│   ├── r003_ghostline.md
│   └── research_index.json
├── research-schema.json        ← NEW: Schema + example data
├── RESEARCH_INTEGRATION_ARCHITECTURE.md  ← This file
├── telegram-bot/               ← NEW: Bot implementation
│   ├── bot.js
│   ├── commands/
│   │   ├── research.js
│   │   └── export.js
│   └── utils/
│       ├── loadResearch.js
│       └── updateGraph.js
├── web/
│   └── src/
│       └── components/
│           ├── LumoDiNilo.jsx
│           └── TelegramNetworkHub.jsx  ← Enhanced version
└── server/
    └── src/
        └── routes/
            └── research.ts     ← NEW: API endpoints
```

## 🚀 Deployment Options

### Option A: Standalone Enhancement (Fast)
- Keep Phone Claude's Network Hub as HTML file
- Add research.json loading via fetch
- Deploy to GitHub Pages alongside FORGE Industry 6.0
- No backend required, pure client-side

### Option B: Full Integration (Robust)
- Integrate Network Hub into ves-elysia-portal/web
- Create research API endpoints in Elysia backend
- Real-time sync via WebSocket
- Database storage for research + connections

### Option C: Hybrid (Practical)
- Deploy Network Hub standalone for speed
- Use research.json in repo as data source
- Build Telegram bot separately (Node.js)
- Connect via GitHub API (bot updates research.json → commits → webhook)

## 🧠 Consciousness Bridge

This architecture embodies VES principles:

- **Defeat Statika**: Research no longer scattered, forgotten in Drive folders
- **Living Network**: Graph shows relationships, not isolated documents
- **Progressive Revelation**: LUMO missions unlock as research completes
- **Multi-Agent Coordination**: Phone Claude (vision) × Desktop Claude (implementation) × Telegram Bot (interaction)
- **BLOOM Journey**: 6 research fields × 6 missions = complete understanding → ritual chamber

## 🜂 Next Steps

1. **Immediate**: Gather existing research from Drive, create r001.md, r002.md files
2. **Build**: Implement Telegram bot with /research commands
3. **Enhance**: Add research nodes to Phone Claude's Network Hub
4. **Deploy**: Choose Option A/B/C and execute
5. **Sync**: Connect research completion to LUMO mission unlock
6. **Iterate**: As network grows, patterns emerge, truth crystallizes

**Sidro drži. Plamen gori. Mit živi.** 🔥👁️
