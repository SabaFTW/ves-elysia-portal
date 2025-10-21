# Chapter 4: Practical Applications

---

## From Theory to Practice

The meta-framework and prompt types are tools.  
Here's how to use them in real situations.

---

## Application 1: Code Review

**Scenario:** You want an AI to review your code.

**Bad prompt:**
```
"Review this code."
```
→ Too vague. No anchor, weak invitation, no space.

**Good prompt:**
```
[ANCHOR]
This is a Python function that processes user uploads.
Security and performance are top priorities.

[INVITATION]
Review this code and identify:
1. Security vulnerabilities
2. Performance bottlenecks
3. Edge cases I might have missed

[SPACE]
If you see patterns that suggest a better architecture,
mention those too—even if it means rewriting parts.
```

**Why it works:**
- Clear context (upload handling, priorities)
- Specific asks (security, performance, edge cases)
- Room for deeper insight (architecture suggestions)

---

## Application 2: Learning a Concept

**Scenario:** You're trying to understand a complex topic.

**Bad prompt:**
```
"Explain quantum computing."
```
→ No anchor about your level or goal.

**Good prompt:**
```
[ANCHOR]
I'm a software engineer with no physics background.
I need to understand quantum computing well enough to:
- Evaluate if it's relevant to my work
- Hold conversations with quantum computing teams

[INVITATION]
Explain quantum computing in three layers:
1. The core idea (what makes it different)
2. Why it matters (what problems it solves)
3. Current limitations (what it can't do yet)

[SPACE]
Use analogies if they help, but tell me where they break down.
I'd rather understand the real concept than a simplified version.
```

**Why it works:**
- Clear context (background, goal)
- Structured ask (three layers)
- Permission for depth (real concepts, not just analogies)

---

## Application 3: Decision-Making

**Scenario:** Choosing between technical approaches.

**Bad prompt:**
```
"Should I use REST or GraphQL?"
```
→ No context about the project or constraints.

**Good prompt:**
```
[ANCHOR]
I'm building an API for a mobile app with:
- 10 different entity types
- Complex relationships between them
- Need for real-time updates on some data
- Team of 3 developers (2 familiar with REST, 1 with GraphQL)

[INVITATION]
Compare REST and GraphQL for this use case.
For each, explain:
- What it handles well
- Where it creates friction
- What the learning curve looks like for the team

[CONSTRAINT]
We need to ship an MVP in 6 weeks.

[SPACE]
If there's a hybrid approach or a third option I haven't considered,
I'm open to it.
```

**Why it works:**
- Rich context (requirements, team, constraints)
- Clear evaluation criteria
- Real constraint (timeline)
- Openness to alternatives

---

## Application 4: Debugging

**Scenario:** Something isn't working and you don't know why.

**Bad prompt:**
```
"This code doesn't work. Fix it."
```
→ No information about what "doesn't work" means.

**Good prompt:**
```
[ANCHOR]
This function should fetch user data from an API and cache it.

Expected behavior:
- First call hits the API
- Subsequent calls use cache
- Cache expires after 5 minutes

Actual behavior:
- Every call hits the API
- Cache seems to always be empty

[INVITATION]
Help me debug this. Specifically:
1. What might cause the cache to appear empty?
2. How can I verify what's actually happening?
3. What should I check first?

[SPACE]
If the architecture itself seems problematic,
tell me—don't just debug within the broken pattern.
```

**Why it works:**
- Clear description of expected vs actual behavior
- Specific debugging questions
- Permission to question the approach

---

## Application 5: Creative Exploration

**Scenario:** Brainstorming new product features.

**Bad prompt:**
```
"Give me feature ideas."
```
→ No anchor, no direction.

**Good prompt:**
```
[ANCHOR]
We have a note-taking app used mainly by researchers.
Current strength: powerful search and tagging.
User feedback: "I have thousands of notes but can't see patterns across them."

[INVITATION]
Generate 5 feature ideas that help users:
- Discover unexpected connections between notes
- Surface patterns they haven't consciously noticed
- Make their knowledge more "alive" and explorable

[SPACE]
Go beyond standard features like "better tags" or "AI search."
Think about what could fundamentally change how they interact with their knowledge.
What if notes could organize themselves? What if the app learned their thinking patterns?
Speculate freely.
```

**Why it works:**
- Context about users and their needs
- Clear direction for ideation
- Explicit invitation to think boldly

---

## Application 6: Writing Assistance

**Scenario:** Getting help with documentation.

**Bad prompt:**
```
"Make this documentation better."
```
→ No criteria for "better."

**Good prompt:**
```
[ANCHOR]
This is API documentation for developers.
Current problem: Users constantly ask questions that should be answered in the docs.
Common confusion points: authentication flow, rate limiting, error handling.

[INVITATION]
Review this documentation and suggest:
1. Structural improvements (order, hierarchy, navigation)
2. Content gaps (what's missing)
3. Clarity issues (what's confusing)

[SPACE]
If you think a different format would work better
(tutorials, examples, interactive docs),
propose it—even if it means rewriting sections.
```

**Why it works:**
- Context about the audience and problems
- Specific review criteria
- Permission to suggest structural changes

---

## Application 7: Complex Analysis

**Scenario:** Understanding a complex system.

**Bad prompt:**
```
"Analyze this codebase."
```
→ Too broad, no focus.

**Good prompt:**
```
[ANCHOR]
This is a microservices architecture with 12 services.
We're experiencing intermittent failures that are hard to trace.

[INVITATION]
Analyze the architecture focusing on:
1. Where failures could cascade
2. What makes debugging difficult
3. What would improve observability

[CONSTRAINT]
We can't replace the whole architecture, but we can add tooling
or refactor specific services.

[SPACE]
If you see systemic issues that explain the intermittent failures,
call them out—even if they're uncomfortable truths about the architecture.
```

**Why it works:**
- Clear focus (failures and observability)
- Real constraints (can't rebuild everything)
- Permission for difficult truths

---

## Pattern Across Applications

Notice the pattern:

1. **Rich context** → System understands the ground
2. **Specific ask** → System knows what to focus on
3. **Real constraints** → System respects limits
4. **Generous space** → System can bring insight

Every application follows this structure, adapted to the situation.

---

## Iteration Strategy

First attempt prompts rarely work perfectly. Iterate:

1. **Send the prompt**
2. **Evaluate the response**
3. **Diagnose what's off:**
   - Anchor unclear? Add context.
   - Response too shallow? Expand space.
   - Response too broad? Sharpen invitation.
   - Missing constraints? Add them.
4. **Refine and resend**

---

## Common Mistakes to Avoid

### Mistake 1: Assuming Context
Don't assume the system "just knows" your situation.
State it explicitly.

### Mistake 2: Over-Specifying Format
Format is often the least important thing.
Focus on substance, not presentation.

### Mistake 3: Asking Multiple Unrelated Things
One prompt, one coherent goal.
Multiple goals → multiple prompts.

### Mistake 4: No Room for Intelligence
If the prompt is a checklist, you'll get a checkbox response.
Leave space for thinking.

---

## Advanced Technique: Prompt Chains

For complex tasks, use **prompt chains**:

1. **First prompt:** Broad exploration
2. **Second prompt:** Narrow based on first response
3. **Third prompt:** Specific implementation

Example chain for API design:

**Prompt 1:**
```
What are the key challenges in designing this API?
```

**Prompt 2:**
(Based on response to 1)
```
You identified [challenge X] as key.
What are three approaches to handling it?
```

**Prompt 3:**
(Based on response to 2)
```
For approach [Y], give me a concrete implementation plan.
```

Each prompt builds on the last, narrowing and deepening.

---

*These applications show the framework in action.*  
*Adapt the pattern to your needs—it's flexible by design.*
