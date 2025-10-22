# Example: Using the Codex

This file demonstrates how to apply the Codex of Emergence principles to real prompts.

## Example 1: Basic Transformation

### Before (Poor Prompt)
```
"Explain APIs."
```

**Problems:**
- No anchor (no context about the user)
- Vague invitation (what aspect of APIs?)
- No space (no guidance on depth or approach)

---

### After (Using the Codex)
```
[ANCHOR]
I'm a frontend developer who's only worked with pre-built API clients.
Now I need to integrate with a new third-party API from scratch.

[INVITATION]
Explain APIs focusing on:
1. What I need to know to integrate one successfully
2. Common pitfalls when working with APIs for the first time
3. How to debug API integration issues

[SPACE]
Use examples if helpful, and if there are fundamental concepts
I should understand beyond just "how to call an endpoint,"
please include those.
```

**Why it works:**
- Clear anchor: frontend dev, new to manual API integration
- Specific invitation: three focused areas
- Space: permission for deeper concepts

---

## Example 2: Decision-Making Prompt

### Before
```
"Should I use MongoDB or PostgreSQL?"
```

### After
```
[ANCHOR]
I'm building a social network for developers where users can:
- Create profiles with skills and projects
- Follow other developers
- Post updates with code snippets
- Search by skills, projects, and topics

Current scale: planning for 10k users in first year, potential for 100k+

[INVITATION]
Compare MongoDB and PostgreSQL for this use case.
For each:
- What features of my app would it handle well?
- What would be challenging?
- What's the operational complexity?

[CONSTRAINT]
Team: 2 backend developers, both familiar with SQL, neither has used MongoDB in production

[SPACE]
If there's a hybrid approach or a third option better suited to this use case,
I want to hear it.
```

---

## Example 3: Learning Prompt

### Before
```
"Teach me React hooks."
```

### After
```
[ANCHOR]
I'm comfortable with React class components and understand lifecycle methods well.
I've heard hooks are "the new way" but don't get why they're better or when to use them.

[INVITATION]
Help me understand React hooks by:
1. Showing me what problem they solve (what was hard before?)
2. Mapping hooks to lifecycle concepts I already know
3. Explaining when I should use hooks vs class components

[SPACE]
I learn best through "aha moments" where I understand the why, not just the how.
If there's a mental model that makes hooks click, start there.
```

---

## Example 4: Debugging Prompt

### Before
```
"My code is broken. Help."
```

### After
```
[ANCHOR]
I'm implementing a caching layer for API responses.

Expected: Cache should store responses for 5 minutes, then expire
Actual: Cache never expires, even after hours

Code approach:
- Using JavaScript Map to store responses
- Storing timestamps with each entry
- Checking timestamp on retrieval

[INVITATION]
Help me debug this. Specifically:
1. What's the most likely cause of cache not expiring?
2. How can I verify what's actually happening?
3. What's a simple test to isolate the problem?

[SPACE]
If my overall approach is flawed (e.g., Map isn't appropriate for this),
tell me that before we debug the details.
```

---

## Example 5: Creative Prompt

### Before
```
"Give me feature ideas for a to-do app."
```

### After
```
[ANCHOR]
I have a to-do app that's technically solid but boring.
Users say: "It works fine but doesn't motivate me to actually use it."

Current features: tasks, lists, due dates, priorities (standard stuff)

[INVITATION]
Generate 5 feature ideas that make the app more engaging and motivating.
Focus on psychological hooks that might actually change behavior,
not just more organizational features.

[SPACE]
Don't limit yourself to standard productivity thinking.
What if a to-do app could:
- Make task completion feel rewarding?
- Turn productivity into a game without being gimmicky?
- Help users understand their own work patterns?

Speculate freely. I can figure out feasibility later.
```

---

## Pattern Recognition

Notice how each improved prompt:

1. **Anchors clearly**: Who's asking, what's their context, what do they care about
2. **Invites specifically**: Clear asks, structured requests, focused questions
3. **Creates space**: Permission for insight, openness to alternatives, trust in intelligence

---

## Quick Reference: The Meta-Framework

For any prompt, apply:

```
[ANCHOR]
- Who are you?
- What's the context?
- What matters to you?

[INVITATION]
- What specifically do you need?
- What form should it take?
- What aspects matter most?

[SPACE]
- Permission to go deeper
- Openness to alternatives
- Trust in intelligence

[CONSTRAINT] (only if needed)
- Real limitations
- Non-negotiables
- Hard boundaries
```

---

## Navigation Check

Before sending any prompt, ask:

- [ ] Would someone unfamiliar with my situation understand the context?
- [ ] Is my request specific enough to be actionable?
- [ ] Have I left room for insight beyond what I explicitly asked for?
- [ ] Are my constraints truly necessary?

---

## Next Steps

1. Take a prompt you're about to send
2. Apply the meta-framework
3. Compare the before/after
4. Send the improved version
5. Evaluate the response quality
6. Refine based on what you learn

The codex is a tool for iterative improvement, not one-time perfection.

---

*Practice transforms principles into instinct.*
