---
description: Show current workflow progress - displays which phase you're in and what's completed
model: haiku
---

# Workflow Status Command

Shows the user where they are in the TDD workflow and what's been completed. Uses the same detection logic as `/continue` but only displays status (doesn't resume).

## Detection Logic

Use the same artifact scanning and state detection as `/continue`:

### Step 1: Check for Feature Spec

```bash
ls documentation/*.md 2>/dev/null | grep -v README.md | head -5
```

If no spec found:
```
═══════════════════════════════════════════════════════════════
                    WORKFLOW STATUS
═══════════════════════════════════════════════════════════════

No feature spec found in documentation/

To get started:
  1. Create a feature spec in documentation/ (see documentation/README.md)
  2. Run /start to begin the TDD workflow

Or run /feature for guided help creating a spec.
═══════════════════════════════════════════════════════════════
```

### Step 2: Check for Wireframes (Optional)

```bash
ls generated-docs/wireframes/_overview.md 2>/dev/null && echo "WIREFRAMES_EXIST"
ls generated-docs/wireframes/screen-*.md 2>/dev/null | wc -l
```

### Step 3: Detect Epic Status

For each epic directory in `generated-docs/stories/epic-*`:

**PLAN phase check:**
```bash
# Check epic overview exists
ls generated-docs/stories/epic-N-*/_epic-overview.md 2>/dev/null

# Count story files
ls generated-docs/stories/epic-N-*/story-*.md 2>/dev/null | wc -l
```

**SPECIFY phase check:**
```bash
# Check for test files
ls web/src/__tests__/integration/epic-N-*.test.tsx 2>/dev/null | wc -l
```

**IMPLEMENT phase check:**
```bash
# Run tests to check pass/fail status
cd web && npm test -- --reporter=json 2>/dev/null
```

**VERIFY phase check:**
```bash
# Parse acceptance tests in story files for [x] vs [ ]
grep -E "^\s*- \[(x| )\]" generated-docs/stories/epic-N-*/story-*.md
```

### Step 4: Parse Acceptance Test Status

Read each story file and count:
- Total acceptance tests: `- [ ]` or `- [x]` patterns
- Completed: `- [x]` patterns
- Remaining: `- [ ]` patterns

### Step 5: Display Status

Format output similar to `/continue` but focused on display:

```
═══════════════════════════════════════════════════════════════
                    WORKFLOW STATUS
═══════════════════════════════════════════════════════════════

Feature: [Feature name from spec file]
Spec: documentation/[filename].md

───────────────────────────────────────────────────────────────
                      Overall Progress
───────────────────────────────────────────────────────────────

[✓ DESIGN] [✓ PLAN] [✓ SPECIFY] [→ IMPLEMENT] [ REVIEW] [ VERIFY]

───────────────────────────────────────────────────────────────
                       Epic Status
───────────────────────────────────────────────────────────────

┌────────┬──────────────────────────────────┬──────────┬────────────┐
│ Epic   │ Name                             │ Status   │ Phase      │
├────────┼──────────────────────────────────┼──────────┼────────────┤
│ Epic 1 │ User Authentication              │ Complete │ VERIFIED   │
│ Epic 2 │ User Profile                     │ Progress │ IMPLEMENT  │
│ Epic 3 │ Settings Page                    │ Planned  │ SPECIFY    │
└────────┴──────────────────────────────────┴──────────┴────────────┘

───────────────────────────────────────────────────────────────
                    Current Position
───────────────────────────────────────────────────────────────

📍 Epic 2, Story 3 (Edit Profile Form)

Stories in Epic 2:
  ✅ Story 1: View Profile Page (5/5 acceptance tests)
  ✅ Story 2: Profile Avatar Upload (3/3 acceptance tests)
  🔄 Story 3: Edit Profile Form (2/5 acceptance tests) ← YOU ARE HERE
  ⏳ Story 4: Save Profile Changes (0/4 acceptance tests)

Current phase: IMPLEMENT
What's happening: Writing code to make tests pass

───────────────────────────────────────────────────────────────
                       Next Steps
───────────────────────────────────────────────────────────────

1. Complete Story 3 implementation (3 acceptance tests remaining)
2. Run tests: npm test
3. When tests pass, continue to Story 4

───────────────────────────────────────────────────────────────
                        Commands
───────────────────────────────────────────────────────────────

/continue      - Resume workflow from current position
/quality-check - Check all quality gates
/feature       - View feature details

═══════════════════════════════════════════════════════════════
```

## Phase Descriptions

Use these plain-language descriptions in the "What's happening" section:

| Phase | Description |
|-------|-------------|
| DESIGN | Creating visual wireframes to plan the UI layout before coding. |
| PLAN | Breaking down your feature into epics and stories with acceptance criteria. |
| SPECIFY | Generating tests that define what the code should do. |
| IMPLEMENT | Writing the actual code to make the tests pass. |
| REVIEW | Checking the code for quality, security, and best practices. |
| VERIFY | Running all quality gates to ensure the code is ready for a pull request. |

## Status Indicators

Use consistent icons:
- ✅ Complete
- 🔄 In Progress
- ⏳ Planned/Not Started
- ❌ Failed/Blocked

For the progress bar:
- `[✓ PHASE]` - Completed
- `[→ PHASE]` - In Progress (current)
- `[ PHASE]` - Not Started

## Edge Cases

### No Work Started (Only Spec Exists)

```
═══════════════════════════════════════════════════════════════
                    WORKFLOW STATUS
═══════════════════════════════════════════════════════════════

Feature: User Dashboard
Spec: documentation/user-dashboard.md

[ DESIGN] [ PLAN] [ SPECIFY] [ IMPLEMENT] [ REVIEW] [ VERIFY]

Status: Not started

Next step: Run /start to begin the TDD workflow
═══════════════════════════════════════════════════════════════
```

### All Epics Complete

```
═══════════════════════════════════════════════════════════════
                    WORKFLOW STATUS
═══════════════════════════════════════════════════════════════

Feature: User Dashboard
Spec: documentation/user-dashboard.md

[✓ DESIGN] [✓ PLAN] [✓ SPECIFY] [✓ IMPLEMENT] [✓ REVIEW] [✓ VERIFY]

🎉 All epics complete!

All 4 epics have been implemented and verified.
Total: 12 stories, 47 acceptance tests passed.

Next step: Create a pull request to merge your feature
═══════════════════════════════════════════════════════════════
```

### Workflow Interrupted Mid-Story

```
═══════════════════════════════════════════════════════════════
                    WORKFLOW STATUS
═══════════════════════════════════════════════════════════════

Feature: Payment System
Spec: documentation/payment-system.md

[✓ DESIGN] [✓ PLAN] [✓ SPECIFY] [→ IMPLEMENT] [ REVIEW] [ VERIFY]

⚠️  Workflow interrupted

Epic 2 was in progress but appears incomplete:
  - Test files exist (12 tests)
  - Some tests passing (8/12)
  - 4 tests failing

Suggested action: Run /continue to resume from Epic 2
═══════════════════════════════════════════════════════════════
```

## Agent Behavior

### DO:
- Show the visual progress bar at the top
- Display per-epic status table for multi-epic features
- Show current position with story-level detail
- Parse and display acceptance test completion counts
- Suggest `/continue` when workflow is in progress
- Use plain language throughout

### DON'T:
- Take any action (this is display-only)
- Show raw file paths without context
- Use technical jargon without explanation
- Leave the user unsure what to do next

## Relationship to /continue

`/status` and `/continue` share the same detection logic but serve different purposes:

| Command | Purpose | Action |
|---------|---------|--------|
| `/status` | "Where am I?" | Display only |
| `/continue` | "Resume work" | Detect + launch appropriate agent |

Users should use `/status` to understand their progress, then `/continue` when ready to resume work.
