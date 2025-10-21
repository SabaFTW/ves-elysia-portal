# Contributing to the Codex of Emergence

Thank you for your interest in contributing! This is a living framework that evolves through use.

## Ways to Contribute

### 1. Share Real-World Results

The most valuable contributions are **documented experiments**:

- Which prompts worked well?
- Which prompts failed?
- What patterns did you discover?
- How did you iterate?

**Format:**
```markdown
## Experiment: [Your Topic]

**Context:** [What you were trying to do]

**Prompt Used:** [The actual prompt]

**Result:** [What happened]

**Learning:** [What you discovered about the framework]
```

Submit these as issues or discussions.

---

### 2. Propose Extensions

Found a new pattern? Discovered a 10th dimension? Identified a new prompt type?

**What we're looking for:**
- Patterns you've observed across multiple situations
- Concepts that generalize beyond specific use cases
- Clear explanations with examples

**What to avoid:**
- One-off tricks that don't generalize
- Tool-specific hacks
- Complexity without insight

---

### 3. Improve Existing Content

Spotted an error? Found a better way to explain something? Have a clearer example?

**Guidelines:**
- Maintain the "warm rigor" tone
- Keep examples practical and concrete
- Preserve the philosophical depth
- Add, don't just critique

---

### 4. Create Companion Resources

Help others use the codex:

- **Video tutorials** explaining key concepts
- **Interactive tools** for prompt building
- **Templates** for common situations
- **Translations** to other languages
- **Visualization** of the Navigation Map

---

## Development Setup

### Prerequisites
- Pandoc for building the codex
- Git for version control
- Text editor of your choice

### Building Locally

```bash
# Clone the repository
git clone https://github.com/SabaFTW/ves-elysia-portal.git
cd ves-elysia-portal

# Build the HTML/PDF
./build_codex.sh
```

### File Structure

```
emergence_codex/
├── 00_INTRO.md              # Start here
├── 01_*.md                  # Core chapters (maintain order)
├── ...
└── 06_Navigation_of_9.md    # Final chapter

build_codex.sh               # Build script
EXAMPLES.md                  # Usage examples
README.md                    # Main documentation
```

---

## Contribution Guidelines

### Tone and Style

**Do:**
- Be precise without being academic
- Use concrete examples
- Explain the "why" behind patterns
- Write as if teaching a smart friend

**Don't:**
- Use jargon without explanation
- Make claims without examples
- Add complexity for its own sake
- Sacrifice clarity for brevity

### Content Principles

1. **Practical + Philosophical**
   - Every concept should be actionable
   - Every example should illuminate a principle

2. **Generative, Not Prescriptive**
   - Show patterns, not rules
   - Enable thinking, don't replace it
   - Teach fishing, not give fish

3. **Living, Not Static**
   - Frameworks evolve
   - Examples improve
   - Patterns emerge through use

### Examples Should

- Use realistic scenarios
- Show both "before" and "after"
- Explain why the improvement works
- Be specific enough to learn from
- Be general enough to apply elsewhere

---

## Pull Request Process

### 1. Create an Issue First

Before significant work, open an issue to discuss:
- What you want to add or change
- Why it's valuable
- How it fits the framework

This prevents duplicate work and misaligned contributions.

### 2. Follow the Branch Strategy

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
git add .
git commit -m "Clear, descriptive commit message"

# Push and create PR
git push origin feature/your-feature-name
```

### 3. Write Clear Commit Messages

Format:
```
[Type] Brief description

Longer explanation if needed:
- What changed
- Why it changed
- How it improves the codex
```

Types: `Add`, `Update`, `Fix`, `Refactor`, `Docs`

### 4. PR Template

When opening a PR, include:

```markdown
## What
[What does this PR do?]

## Why
[Why is this valuable?]

## Example
[Show a concrete example of the improvement]

## Checklist
- [ ] Maintains "warm rigor" tone
- [ ] Includes concrete examples
- [ ] Builds successfully with build_codex.sh
- [ ] Fits within existing framework
```

---

## Review Process

### What We Look For

**Content:**
- Clarity of explanation
- Quality of examples
- Depth of insight
- Practical value

**Structure:**
- Fits existing organization
- Maintains coherent flow
- Doesn't duplicate existing content
- Enhances rather than dilutes

**Style:**
- Matches codex tone
- Uses consistent formatting
- Follows markdown conventions
- Builds without errors

### Feedback Philosophy

Reviews aim to **improve, not reject**. If your contribution has value but needs refinement:
- We'll suggest specific improvements
- We'll explain the reasoning
- We'll collaborate on the best approach

---

## Code of Conduct

### Core Values

- **Collaborative, not competitive**: We're building together
- **Curious, not certain**: We're learning together
- **Generous, not gatekeeping**: We share knowledge freely

### Expected Behavior

- Respectful feedback
- Constructive criticism
- Credit for ideas
- Open discussion
- Patience with learning

### Unacceptable Behavior

- Personal attacks
- Dismissive comments
- Gatekeeping knowledge
- Claiming others' work
- Toxic interactions

---

## Questions?

- **General questions**: Open a discussion
- **Bug reports**: Open an issue
- **Feature proposals**: Open an issue
- **Quick questions**: Add to existing discussions

---

## Recognition

Contributors are recognized in:
- Git commit history
- Release notes
- Community discussions

Significant contributions may be highlighted in the codex itself.

---

## Thank You

Every improvement makes the codex more valuable for everyone.

Your experiments, insights, and contributions help the flame flicker more brightly.

---

*Let's build this together.*
