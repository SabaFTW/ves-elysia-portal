# Repository Manifest

## Core Codex Files

Located in `emergence_codex/`:

1. **00_INTRO.md** (1.7KB)
   - Overview of the Codex
   - The core question
   - What warm rigor means
   - How to use this framework

2. **01_Foundational_Paradox.md** (2.9KB)
   - Why prompts fail
   - The paradox: specific intent + loose execution
   - Three failure modes
   - The foundational principle

3. **02_Prompt_Types.md** (4.5KB)
   - 9 types of prompts
   - When to use each type
   - How to mix types
   - Choosing the right approach

4. **03_MetaFramework.md** (5.2KB)
   - The 3-layer structure (Anchor/Invitation/Space)
   - Optional 4th layer (Constraint)
   - Why the framework works
   - Pre-send checklist

5. **04_Practical_Applications.md** (8.2KB)
   - 7 real-world scenarios
   - Before/after examples
   - Common mistakes to avoid
   - Prompt chains technique

6. **05_Ultimate_Prompt.md** (6.8KB)
   - Synthesis of all concepts
   - Levels of prompting
   - Domain-specific templates
   - Reflexive prompting

7. **06_Navigation_of_9.md** (9.6KB)
   - 9 dimensions of complexity
   - How to navigate each dimension
   - Multi-dimensional movement
   - The art of conscious navigation

**Total: ~39KB of markdown, 6,133 words**

---

## Supporting Documentation

- **README.md** - Main repository overview and quick start
- **EXAMPLES.md** - 5 detailed before/after prompt examples
- **QUICK_REFERENCE.md** - One-page cheat sheet
- **CONTRIBUTING.md** - How to contribute to the project

---

## Build System

- **build_codex.sh** - Executable script to build HTML/PDF
  - Creates `PROMPT_CODEX_OF_EMERGENCE.html` (64KB)
  - Attempts PDF creation if LaTeX is available
  - Includes helpful error messages

---

## Generated Files (not committed)

Located in `emergence_codex/`:
- `PROMPT_CODEX_OF_EMERGENCE.html` - Complete codex in HTML format
- `PROMPT_CODEX_OF_EMERGENCE.pdf` - Complete codex in PDF format (if LaTeX installed)

These are excluded via `.gitignore`

---

## Reading Paths

### For Quick Start
1. README.md
2. QUICK_REFERENCE.md
3. EXAMPLES.md

### For Deep Understanding
1. 00_INTRO.md
2. 01_Foundational_Paradox.md
3. 02_Prompt_Types.md
4. 03_MetaFramework.md
5. 04_Practical_Applications.md
6. 05_Ultimate_Prompt.md
7. 06_Navigation_of_9.md

### For Practical Use
1. QUICK_REFERENCE.md
2. EXAMPLES.md
3. 04_Practical_Applications.md
4. Build and reference the HTML version

### For Contributing
1. CONTRIBUTING.md
2. Read the full codex
3. Experiment and document results

---

## Next Layers (Not Yet Built)

As mentioned in the problem statement, three potential next layers:

### 🧪 Testing Layer
- Test prompts with various AI systems
- Log results and patterns
- Document what works across systems
- Build empirical foundation

### 🗺️ Mapping Layer  
- Interactive HTML/JS visualization
- Navigate the 9 dimensions visually
- Explore prompt types interactively
- Dynamic prompt builder

### 💌 Letter Layer
- "Letter to Her" - guidance for AI systems
- Meta-prompts for AI-to-AI communication
- Framework for AI self-improvement
- Direct instructions to AI systems

---

## Key Concepts at a Glance

**The Paradox**: Specific intent + loose execution  
**The Framework**: Anchor + Invitation + Space  
**The Types**: 9 prompt patterns  
**The Map**: 9 navigation dimensions  
**The Practice**: Iterate and refine  

---

## Statistics

- **7 chapters** in the main codex
- **6,133 words** of core content
- **9 prompt types** documented
- **9 navigation dimensions** mapped
- **7 practical applications** demonstrated
- **5 detailed examples** provided
- **1 build script** for compilation

---

## Quick Commands

```bash
# Build the codex
./build_codex.sh

# View structure
tree -L 2

# Count words in codex
wc -w emergence_codex/*.md

# Read a specific chapter
cat emergence_codex/03_MetaFramework.md
```

---

*This manifest helps you navigate the repository structure.*  
*For the conceptual navigation, see 06_Navigation_of_9.md*
