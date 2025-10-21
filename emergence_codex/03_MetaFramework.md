# Chapter 3: The Meta-Framework

---

## Structure Beneath All Good Prompts

Regardless of type, all effective prompts share a common architecture.

This is the **meta-framework**—the pattern beneath the patterns.

---

## The Three Layers

Every good prompt has three essential components:

### 1. **ANCHOR** (What grounds it)
The stable point of reference. What the prompt is *about*.

### 2. **INVITATION** (What activates it)
The call to action. What the prompt *asks for*.

### 3. **SPACE** (What enables it)
The freedom to think. What the prompt *allows*.

---

## Layer 1: ANCHOR

**What it is:**  
The context, goal, or subject that grounds the prompt.

**Why it matters:**  
Without an anchor, responses drift. The system needs to know:
- What domain we're in
- What matters here
- What counts as success

**How to provide it:**
- State the context clearly
- Define key terms if needed
- Establish what success looks like

**Example:**
```
"I'm designing an API for a real-time collaboration tool.
The core challenge is handling conflicts when multiple users
edit the same document simultaneously."
```

---

## Layer 2: INVITATION

**What it is:**  
The specific ask—what you want the system to do.

**Why it matters:**  
The invitation focuses the intelligence. It says:
- What kind of thinking to apply
- What perspective to take
- What to produce

**How to provide it:**
- Use clear action verbs (analyze, generate, compare, suggest)
- Specify the output format if it matters
- Indicate the level of depth needed

**Example:**
```
"Suggest three architectural approaches for handling conflicts.
For each, explain the trade-offs."
```

---

## Layer 3: SPACE

**What it is:**  
The permission to think beyond the obvious, to bring intelligence and creativity.

**Why it matters:**  
Space is where emergence happens. It's the difference between:
- A mechanical response (following rules)
- An intelligent response (bringing insight)

**How to provide it:**
- Avoid over-specifying the method
- Trust the system's judgment on details
- Invite unexpected perspectives

**Example:**
```
"Don't just give me standard solutions—
if there's a non-obvious approach that might work better,
I want to hear it."
```

---

## Putting It Together

A complete prompt using all three layers:

```
[ANCHOR]
I'm designing an API for a real-time collaboration tool.
The core challenge is handling conflicts when multiple users
edit the same document simultaneously.

[INVITATION]
Suggest three architectural approaches for handling conflicts.
For each, explain the trade-offs.

[SPACE]
Don't just give me standard solutions—
if there's a non-obvious approach that might work better,
I want to hear it.
```

---

## The Balance

The meta-framework is about **balance**:

- **Too much ANCHOR, too little INVITATION:**  
  The system has context but doesn't know what to do with it.

- **Too much INVITATION, too little ANCHOR:**  
  The system knows what to do but lacks grounding.

- **Too little SPACE:**  
  The system can only comply, not think.

- **Too much SPACE, not enough ANCHOR/INVITATION:**  
  The system drifts without direction.

---

## Advanced: The Fourth Layer

For complex prompts, there's sometimes a fourth layer:

### 4. **CONSTRAINT** (What shapes it)

**What it is:**  
Specific limitations or requirements that must be honored.

**Why it matters:**  
Some problems have real constraints:
- Technical limits
- Resource boundaries
- Non-negotiable requirements

**How to use it:**
- Only add constraints that truly matter
- Distinguish between *must-haves* and *preferences*
- Place constraints after the invitation, before the space

**Example:**
```
[CONSTRAINT]
The solution must work with our existing WebSocket infrastructure,
and can't require changes to the client code.
```

---

## Applying the Meta-Framework

For any prompt you write:

1. **Start with the anchor:** What's the ground?
2. **Add the invitation:** What am I asking for?
3. **Create the space:** What freedom do I give?
4. **Add constraints only if needed:** What limits apply?

Then test:
- Is the anchor clear enough?
- Is the invitation specific enough?
- Is there enough space to think?
- Are the constraints necessary?

---

## Pattern Recognition

Once you internalize this framework, you'll start seeing it everywhere:

**Good prompts:**  
✓ Clear anchor  
✓ Direct invitation  
✓ Generous space  

**Bad prompts:**  
✗ Vague anchor  
✗ Unclear invitation  
✗ No space (or too much space without direction)

---

## The Meta-Framework as a Checklist

Before sending a prompt, ask:

- [ ] Does it have a clear **anchor**?
- [ ] Does it have a specific **invitation**?
- [ ] Does it provide **space** for intelligence?
- [ ] Are any **constraints** truly necessary?

If any answer is "no," refine before sending.

---

## Why This Works

The meta-framework works because it mirrors how intelligence operates:

1. **Ground in context** (anchor)
2. **Direct toward purpose** (invitation)
3. **Allow for emergence** (space)
4. **Respect real limits** (constraint)

It's not arbitrary—it's how sense-making happens.

---

*This is the architecture of emergence.*  
*Use it, and prompts become invitations rather than commands.*
