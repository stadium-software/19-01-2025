# /continue - Resume interrupted TDD workflow

Resume the TDD workflow from where it was interrupted, automatically detecting the current phase and continuing with the appropriate agents.

## What This Command Does

The `/continue` command:

1. **Detects the current state** by analyzing:
   - Existing wireframes in `generated-docs/wireframes/`
   - Epic and story files in `generated-docs/stories/`
   - Test files in `web/src/__tests__/integration/`
   - Implementation files in `web/src/`
   - Acceptance test completion status (checkboxes in story files)

2. **Determines the current phase** for each epic:
   - **DESIGN**: Wireframes created
   - **PLAN**: Epics and stories created
   - **SPECIFY**: Tests generated
   - **IMPLEMENT**: Code written to pass tests
   - **REVIEW**: Code reviewed
   - **VERIFY**: Quality gates passed

3. **Resumes execution** from the appropriate point following the epic-by-epic workflow

## Usage

```bash
# In Claude Code chat:
/continue
```

## Detection Logic

### Phase Detection per Epic

For each epic, the command checks:

1. **PLAN phase complete?**
   - ✅ Epic overview file exists: `generated-docs/stories/epic-N-name/_epic-overview.md`
   - ✅ All story files exist: `generated-docs/stories/epic-N-name/story-N-*.md`

2. **SPECIFY phase complete?**
   - ✅ All test files exist: `web/src/__tests__/integration/epic-N-*.test.tsx`
   - ✅ Tests are failing (components don't exist yet)

3. **IMPLEMENT phase complete?**
   - ✅ All components/pages referenced in tests exist
   - ✅ All API functions exist
   - ✅ Tests are passing (`npm test` succeeds)

4. **REVIEW phase complete?**
   - ✅ Code-reviewer agent has reviewed the implementation
   - ✅ Review feedback has been addressed

5. **VERIFY phase complete?**
   - ✅ All 5 quality gates pass
   - ✅ All acceptance tests in story files are checked: `- [x]`
   - ✅ Commit/PR created

### Epic Status Detection

The command determines which epic to work on next:

- **Epic fully complete**: All story acceptance tests are `- [x]` checked
- **Epic in progress**: Some acceptance tests checked, some `- [ ]` unchecked
- **Epic not started**: No acceptance tests checked

## Resume Scenarios

### Scenario 1: Tests generated, implementation not started

```
Detection:
- Epic 1-4 test files exist in web/src/__tests__/integration/
- No implementation files exist
- Tests are failing

Action:
→ Resume with developer agent for Epic 1, Story 1
```

### Scenario 2: Epic 1 complete, Epic 2 in progress

```
Detection:
- Epic 1: All acceptance tests checked [x], tests passing
- Epic 2: Tests exist, some components implemented, some tests failing
- Epic 3-4: Only tests exist

Action:
→ Resume with developer agent for Epic 2 at first failing story
```

### Scenario 3: Epic 1-2 implemented but not reviewed

```
Detection:
- Epic 1-2: All tests passing
- Epic 3-4: Tests exist, not implemented
- No code review completed

Action:
→ Resume with code-reviewer agent for Epic 1
```

### Scenario 4: Planning incomplete

```
Detection:
- Epic 1: Stories exist
- Epic 2: No stories yet (only epic overview or nothing)
- No tests generated

Action:
→ Resume with feature-planner agent for Epic 2
```

## Workflow Logic

The `/continue` command follows this decision tree:

```
1. Check for feature spec in documentation/
   ├─ NOT FOUND → Ask user for spec location → Exit
   └─ FOUND → Continue

2. Check for wireframes (optional)
   ├─ NONE → Note: No wireframes (skip DESIGN phase)
   └─ FOUND → Note: Wireframes available

3. For each epic (1, 2, 3, 4...):

   A. Check PLAN phase:
      ├─ Epic overview missing → Resume feature-planner for this epic → STOP
      ├─ Story files missing → Resume feature-planner for this epic → STOP
      └─ Complete → Continue to B

   B. Check SPECIFY phase:
      ├─ Test files missing → Resume test-generator for this epic → STOP
      └─ Complete → Continue to C

   C. Check IMPLEMENT phase:
      ├─ Tests failing → Resume developer for this epic, first failing story → STOP
      └─ Complete → Continue to D

   D. Check REVIEW phase:
      ├─ Not reviewed → Resume code-reviewer for this epic → STOP
      └─ Complete → Continue to E

   E. Check VERIFY phase:
      ├─ Quality gates failing → Resume quality-gate-checker for this epic → STOP
      ├─ Acceptance tests not all checked → Ask user to update story files → STOP
      └─ Complete → Mark epic complete, continue to next epic (loop to 3)

4. All epics complete:
   └─ Display success message → Suggest final PR creation
```

## Example Output

```
📋 Analyzing project state...

✅ Feature spec found: documentation/BetterBond-Commission-Payments-POC-002.md
✅ Wireframes found: 8 wireframes in generated-docs/wireframes/

📊 Epic Status:
┌────────┬──────────────────────────────────┬──────────┬────────────┐
│ Epic   │ Name                             │ Status   │ Phase      │
├────────┼──────────────────────────────────┼──────────┼────────────┤
│ Epic 1 │ Dashboard & Navigation           │ Complete │ VERIFIED   │
│ Epic 2 │ Payment Management Core          │ Complete │ VERIFIED   │
│ Epic 3 │ Payment Forms                    │ Progress │ IMPLEMENT  │
│ Epic 4 │ Payment Allocation               │ Planned  │ SPECIFY    │
└────────┴──────────────────────────────────┴──────────┴────────────┘

📍 Current Position: Epic 3, Story 2 (Regular Payment Form)
   - Story 1: ✅ Complete (tests passing, acceptance tests checked)
   - Story 2: 🔄 In Progress (tests failing, 2/5 acceptance tests checked)
   - Story 3-5: ⏳ Not started (tests exist, not implemented)

🚀 Resuming workflow...

Launching developer agent for Epic 3, Story 2: Regular Payment Form
```

## Implementation Notes

### Key Files to Check

**Planning (PLAN phase):**
- `generated-docs/stories/epic-*/_epic-overview.md`
- `generated-docs/stories/epic-*/story-*.md`

**Testing (SPECIFY phase):**
- `web/src/__tests__/integration/epic-*.test.tsx`
- `web/src/__tests__/integration/epic-*.test.ts`

**Implementation (IMPLEMENT phase):**
- `web/src/app/**/*.tsx` (pages)
- `web/src/components/**/*.tsx` (components)
- `web/src/lib/api/**/*.ts` (API functions)
- `web/src/lib/validation/**/*.ts` (schemas)
- `web/src/types/**/*.ts` (type definitions)

**Verification (VERIFY phase):**
- Checkbox status in story files: `- [x]` vs `- [ ]`
- Test results: `npm test` exit code
- Quality gates: All 5 gates passing

### Status Detection Algorithm

```typescript
// Pseudo-code for epic status detection
function detectEpicStatus(epicNumber: number): EpicStatus {
  const epicDir = `generated-docs/stories/epic-${epicNumber}-*`;
  const storyFiles = glob(`${epicDir}/story-*.md`);

  // Check PLAN phase
  if (!fileExists(`${epicDir}/_epic-overview.md`)) {
    return { phase: 'PLAN', status: 'incomplete', resumeWith: 'feature-planner' };
  }
  if (storyFiles.length === 0) {
    return { phase: 'PLAN', status: 'incomplete', resumeWith: 'feature-planner' };
  }

  // Check SPECIFY phase
  const testFiles = glob(`web/src/__tests__/integration/epic-${epicNumber}-*.test.*`);
  if (testFiles.length === 0) {
    return { phase: 'SPECIFY', status: 'incomplete', resumeWith: 'test-generator' };
  }

  // Check IMPLEMENT phase
  const testResults = runTests(testFiles);
  if (testResults.failed > 0) {
    const failingStory = detectFailingStory(testResults);
    return { phase: 'IMPLEMENT', status: 'in-progress', resumeWith: 'developer', story: failingStory };
  }

  // Check VERIFY phase
  const acceptanceTests = parseAcceptanceTests(storyFiles);
  const allChecked = acceptanceTests.every(test => test.checked);
  if (!allChecked) {
    return { phase: 'VERIFY', status: 'incomplete', resumeWith: 'quality-gate-checker' };
  }

  return { phase: 'VERIFY', status: 'complete' };
}
```

### Agent Resumption

When resuming, provide full context to the agent:

```typescript
// For developer agent
const prompt = `
Resume implementation for Epic ${epicNumber}: ${epicName}

Current status:
- Epic ${epicNumber-1}: ✅ Complete
- Epic ${epicNumber}: 🔄 In Progress
  - Story ${storyNumber}: Tests failing, ${checkedCount}/${totalCount} acceptance tests checked

Continue implementing Story ${storyNumber}: ${storyTitle}

Test file: ${testFilePath}
Story file: ${storyFilePath}

Make the tests pass by implementing the required components/functions.
`;
```

## Related Commands

- `/start` - Start TDD workflow from the beginning
- `/feature` - Start a new feature
- `/quality-check` - Validate all 5 quality gates

## Notes

- The `/continue` command is idempotent - running it multiple times will detect the same state and resume from the same point
- If the state is ambiguous, the command will ask for clarification
- Always commits work before handing off to the next agent
- Follows the epic-by-epic workflow documented in WORKFLOWS.md
