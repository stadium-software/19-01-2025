---
description: Start the TDD workflow - kicks off feature-planner to process specs from documentation/
---

Start the feature development workflow.

## Commit Policy

**IMPORTANT:** To avoid loss of work, create commits/PRs at every logical point:

- After each phase completes (DESIGN, PLAN, SPECIFY, IMPLEMENT, REVIEW, VERIFY)
- After creating multiple files (e.g., after every 2-3 wireframes or stories)
- Before handing off to another agent

Each agent is responsible for committing its outputs before completing.

## Session Handoff Policy

**Before handing off to another agent, always clear/end the current session first.**

This ensures:
- Clean context for the next agent
- No confusion from previous conversation state
- Clear boundaries between phases

## User Approval Policy (CRITICAL)

**NEVER auto-approve on behalf of the user.** When an agent (feature-planner, ui-ux-designer, etc.) asks for approval:

1. **STOP** and display the proposed content to the user in the conversation
2. **WAIT** for the user to explicitly approve, modify, or reject
3. **Only proceed** after receiving actual user confirmation

**Examples of what NOT to do:**
- ❌ "The feature-planner proposed 3 epics. Let me continue..."
- ❌ "Epics look good, proceeding to stories..."
- ❌ Spawning another Task to auto-approve

**Examples of correct behavior:**
- ✅ "The feature-planner has proposed these epics: [show epics]. Do you approve this structure?"
- ✅ Wait for user to say "approved" or provide feedback
- ✅ Only then continue to the next phase

## Workflow Overview

```
/start → [ui-ux-designer] → feature-planner → test-generator → developer → code-reviewer → quality-gate-checker
              DESIGN             PLAN            SPECIFY        IMPLEMENT      REVIEW           VERIFY
```

## Quality Gate Strategy (Choose First)

Before starting, ask the user to choose a quality gate approach for TDD:

**Option A: Green Build Approach (Recommended)**
- Test files are created but tests for unimplemented stories are skipped
- Each story uncomments/enables its tests during implementation
- Quality gates always pass (clean TypeScript/ESLint build)
- More conventional and CI/CD friendly

**Option B: Red-Green-Refactor TDD**
- All tests written upfront (will fail TypeScript/ESLint until implemented)
- Quality gates FAIL until all stories in epic are complete
- True TDD workflow but requires understanding failed gates are expected
- Requires CI/CD configuration to handle this pattern

**Ask the user:**
> "For quality gates: Would you like (A) Green Build Approach where tests are skipped until implementation, or (B) Red-Green-Refactor TDD where all tests are written upfront and gates fail until complete?
>
> Recommendation: Option A for easier CI/CD integration."

Record their choice and ensure all agents follow this approach consistently.

## What to Do

**First, check if wireframes would be helpful for this feature.**

If the feature involves UI screens, ask the user:

> "This feature appears to involve UI. Would you like me to create wireframes first using the **ui-ux-designer** agent, or proceed directly to planning?"

- **If yes to wireframes:** Use the **ui-ux-designer** agent first, then continue to feature-planner
- **If no wireframes needed:** Use the **feature-planner** agent directly

## Option A: Start with Wireframes (UI Features)

Use the **ui-ux-designer** agent to create wireframes:

```
Create wireframes for the feature specification in documentation/
```

The ui-ux-designer will:
1. Read the spec from `documentation/`
2. Identify screens needed (with your approval)
3. Create ASCII wireframes for each screen
4. Save to `generated-docs/wireframes/`
5. Hand off to feature-planner

## Option B: Start with Planning (Default)

Use the **feature-planner** agent to begin processing feature specifications.

**Default spec location:** `documentation/` directory

The feature-planner will:
1. Search for specs in `documentation/` (or ask for a path if none found)
2. Check for existing wireframes in `generated-docs/wireframes/`
3. Break the spec into epics → **STOP: Display epics to user and wait for explicit approval**
4. Break approved epic into stories → **STOP: Display stories to user and wait for explicit approval**
5. Write acceptance tests for each story (referencing wireframes if available)
6. Hand off to test-generator for SPECIFY phase

**IMPORTANT:** Steps 3 and 4 require you to surface the proposed content to the user and wait for their approval. Do NOT auto-approve.

## Starting the Agent

Invoke the appropriate agent based on user preference:

**For wireframes first:**
```
Look for feature specifications in the documentation/ directory and create wireframes for the UI screens.
```

**For planning directly:**
```
Look for feature specifications in the documentation/ directory and begin the planning process.
```

If no specs are found, ask the user to provide a spec or specify its location.