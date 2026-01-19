# Agent Workflow Guide

This guide explains how to use the Claude Code agent workflow system to build features using Test-Driven Development (TDD). The workflow uses six specialized agents that guide you from design through deployment.

---

## Quick Start

**New to the workflow?** Here's how to get started:

1. **Create a feature spec** in `documentation/your-feature.md`
2. **Run `/start`** to begin the TDD workflow
3. **Follow the prompts** - each agent guides you through its phase
4. **Approve outputs** at key checkpoints (stories, tests, PRs)

**Which agent should I use?**

| Starting Point | Use This Agent | Command |
|----------------|----------------|---------|
| New feature with UI | `ui-ux-designer` | "Create wireframes for [feature]" |
| New feature (any) | `feature-planner` | `/start` or "Plan [feature]" |
| Stories already exist | `test-generator` | "Generate tests for [epic]" |
| Tests already exist | `developer` | "Implement [stories]" |
| Code ready for review | `code-reviewer` | "Review the code changes" |
| Ready for PR | `quality-gate-checker` | `/quality-check` |

---

## The Six Agents

| Agent | Phase | Purpose | Key Output |
|-------|-------|---------|------------|
| **ui-ux-designer** | DESIGN | Creates ASCII wireframes for UI features | `generated-docs/wireframes/*.md` |
| **feature-planner** | PLAN | Breaks specs into epics, stories, acceptance criteria | `generated-docs/stories/**/*.md` |
| **test-generator** | SPECIFY | Generates failing tests before implementation | `web/src/__tests__/integration/*.test.ts(x)` |
| **developer** | IMPLEMENT | Makes tests pass, creates PRs | Feature branch + Draft PR |
| **code-reviewer** | REVIEW | Reviews code quality, security, patterns | Review findings |
| **quality-gate-checker** | VERIFY | Validates all quality gates before merge | Quality gate report |

### Agent Details

**ui-ux-designer** (Optional)
- Creates text-based wireframes from feature specs
- Use before `feature-planner` for UI-heavy features
- Skip for backend-only features or when wireframes exist externally

**feature-planner**
- Plans ONE epic at a time (never multiple)
- Pauses for approval at each stage (epics → stories → acceptance tests)
- Commits story files before handing off

**test-generator**
- Tests MUST fail initially (this is TDD)
- Imports components that don't exist yet
- Only mocks HTTP client, never code under test
- **Tests must verify user behavior, NOT implementation details** (see CLAUDE.md for guidelines)

**developer**
- Implements ONE story at a time
- Creates draft PR and STOPS for approval
- Does NOT write new tests—only makes existing tests pass

**code-reviewer**
- Does NOT modify code—only reports findings
- Categorizes by severity: Critical, High, Suggestions
- Checks TypeScript, React, Next.js, security, accessibility

**quality-gate-checker**
- Runs 5 gates: Functional, Security, Code Quality, Testing, Performance
- Generates PR-ready markdown report
- Invokable via `/quality-check`

---

## Workflow Diagram

```
┌──────────┐   ┌──────┐   ┌─────────┐   ┌───────────┐   ┌────────┐   ┌────────┐
│  DESIGN  │ → │ PLAN │ → │ SPECIFY │ → │ IMPLEMENT │ → │ REVIEW │ → │ VERIFY │
│ (opt.)   │   │      │   │         │   │           │   │        │   │        │
└──────────┘   └──────┘   └─────────┘   └───────────┘   └────────┘   └────────┘
     │              │           │              │              │            │
     ▼              ▼           ▼              ▼              ▼            ▼
 Wireframes    Stories &   Failing       Passing        Review       Quality
               Acceptance  Tests         Tests +        Findings     Gate
               Criteria                  Code + PR                   Report
```

### The 5 Quality Gates

| Gate | Type | What It Checks |
|------|------|----------------|
| 1. Functional | Manual | Feature works per acceptance criteria |
| 2. Security | Automated | `npm audit`, no hardcoded secrets |
| 3. Code Quality | Automated | TypeScript, ESLint, Next.js build |
| 4. Testing | Automated | Tests pass, coverage threshold met |
| 5. Performance | Manual | Page loads < 3s, no UI freezing |

---

## Choosing Your Starting Point

**Start with `feature-planner` (most common):**
- New features from a spec
- Complex requirements needing breakdown
- When you want the full TDD workflow

**Start with `ui-ux-designer`:**
- UI-heavy features needing visual planning
- When stakeholders need wireframe sign-off
- Multi-screen features with complex flows

**Start with `test-generator`:**
- Stories already exist in `generated-docs/stories/`
- Resuming after planning was completed earlier
- Migrating existing features to TDD

**Start with `developer`:**
- Failing tests already exist
- Resuming after test generation
- Quick fixes where tests are already written

**Start with `quality-gate-checker`:**
- Implementation complete, ready for PR
- Want to verify before creating PR
- Run via `/quality-check`

---

## Example Workflows

### Example 1: Full Workflow (New Dashboard Widget)

**Scenario:** Building a portfolio value widget from scratch.

| Step | Agent | Action | Output |
|------|-------|--------|--------|
| 1 | ui-ux-designer | Create wireframes for 4 states | 5 wireframe files |
| 2 | feature-planner | Break into 4 epics, plan Epic 1 | 4 story files |
| 3 | test-generator | Generate 14 failing tests | 1 test file |
| 4 | developer | Implement, create draft PR | 3 source files + PR |
| 5 | code-reviewer | Review code quality | 3 suggestions (non-blocking) |
| 6 | quality-gate-checker | Validate all 5 gates | All passed, ready to merge |

[See full detailed walkthrough →](./examples/example-1-full-workflow.md)

---

### Example 2: Mid-Chain Entry (API Integration)

**Scenario:** Adding API integration to existing page with wireframes already done.

| Step | Agent | Action |
|------|-------|--------|
| 1 | feature-planner | "Plan API integration stories" (skip wireframes) |
| 2 | test-generator | Generate tests from stories |
| 3 | developer | Implement and create PR |
| 4+ | (continue as normal) | ... |

**Key:** Skip `ui-ux-designer` when wireframes exist externally.

[See detailed example →](./examples/example-2-mid-chain-entry.md)

---

### Example 3: Bug Fix Workflow

**Scenario:** Fixing a formatting bug in existing component.

| Step | Action |
|------|--------|
| 1 | Write a failing regression test first |
| 2 | Fix the bug (minimal change) |
| 3 | Verify test passes |
| 4 | Run `/quality-check` |
| 5 | Create PR |

**Key:** Skip planning phases for isolated bug fixes.

[See detailed example →](./examples/example-3-bug-fix.md)

---

## Override Behavior

### Skipping Agents

Agents are suggestions, not requirements. You can skip any agent:

```
# Skip wireframes
"No wireframes needed, let's go straight to planning"

# Skip code review
"Tests pass, let's go directly to quality gates"
```

### Re-running Agents

You can re-run any agent at any time:

```
# Regenerate tests after story changes
"Regenerate tests for Epic 1"

# Get another code review after changes
"Review the updated code"
```

### Custom Workflow Paths

| Scenario | Recommended Path |
|----------|------------------|
| Small bug fix | test → implement → verify |
| Backend-only feature | plan → specify → implement → verify |
| Prototype/spike | implement only (no tests) |
| Refactoring | specify (new tests) → implement → verify |

---

## Troubleshooting

### Common Issues

**Q: Tests pass immediately after generation**
- Tests should FAIL initially. If they pass, implementation already exists or tests don't assert anything meaningful.
- Regenerate tests or check that components don't exist yet.

**Q: Tests are failing but seem to test the wrong things**
- Tests should verify **user-observable behavior**, not implementation details.
- Bad signs: testing CSS classes, function call counts, internal state, DOM structure.
- Good signs: testing what users see, error messages, successful workflows.
- See CLAUDE.md "Acceptance Test Quality Checklist" for full guidelines.
- Regenerate tests if needed: "Regenerate tests focusing on user behavior, not implementation details"

**Q: Agent suggests next agent but I want to do something else**
- Agent suggestions are optional. Tell it what you want to do instead.

**Q: Workflow was interrupted mid-way**
- Context files in `.claude/context/` preserve state
- Resume by invoking the next agent in the chain
- Example: "Continue implementing Epic 1"

**Q: Want to change stories after tests were generated**
- Modify story files in `generated-docs/stories/`
- Regenerate tests: "Regenerate tests for Epic 1 with updated acceptance criteria"

**Q: Quality gate failed**
- Review the failure reason in the output
- Fix the issue and re-run `/quality-check`
- Don't skip gates—they catch real issues

### Edge Cases

**Multiple people working on same feature:**
- Each person should work on different epics
- Context files may conflict—coordinate or clear `.claude/context/`

**Existing tests in codebase:**
- test-generator creates NEW test files, doesn't modify existing
- Run full test suite to ensure no conflicts

**Agent seems stuck or confused:**
- Provide clearer context: "I'm at the IMPLEMENT phase with failing tests in portfolio-widget.test.tsx"
- Reference specific files: "Please implement the PortfolioValueWidget component to pass the tests"

---

## Additional Resources

- [Example 1: Full Workflow](./examples/example-1-full-workflow.md) - Complete step-by-step walkthrough
- [Example 2: Mid-Chain Entry](./examples/example-2-mid-chain-entry.md) - Starting from existing artifacts
- [Example 3: Bug Fix](./examples/example-3-bug-fix.md) - Alternative workflow for fixes
- [CLAUDE.md](../CLAUDE.md) - Project patterns and conventions
- [Agent configurations](../.claude/agents/) - Individual agent definitions
