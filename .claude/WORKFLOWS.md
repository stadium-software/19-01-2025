# AI-Driven Development Workflows

Quick reference for common workflows in this template.

---

## Workflow 1: Starting a New Project

**Scenario:** You just created a new project from this GitHub template.

### Steps:

```bash
# 1. Create from template
Click "Use this template" on GitHub → Name your project → Create

# 2. Clone and open
git clone https://github.com/your-username/your-new-project.git
cd your-new-project
code .  # Opens in VSCode

# 3. Initialize (choose ONE):

# Option A - Automatic (recommended)
cd web
npm install
# Ready to code!

# Option B - Using Claude Code
# In Claude Code chat, type:
/start
# Runs npm install
# Verifies setup
# Displays next steps

# 4. Start your first feature
# In Claude Code chat, type:
/feature
# Claude guides you through building your first feature
```

### Expected Timeline:
- **Setup:** 2-5 minutes
- **First feature:** Depends on complexity (simple feature ~15-30 min with AI assistance)

---

## Workflow 2: Adding Features to Existing Project

**Scenario:** Your project is already set up and you want to add a new feature.

### Steps:

```bash
# 1. Open your existing project
cd your-existing-project
code .  # Opens in VSCode

# 2. (Optional) Start dev server
cd web
npm run dev

# 3. Start new feature
# In Claude Code chat, type:
/feature
# Claude detects existing project and guides you through adding the feature
```

### What Claude Will Do:

1. **Detect project state:**
   - Confirms project is initialized
   - Checks for in-progress features
   - Assesses project maturity

2. **Gather requirements:**
   - Asks what feature you want to build
   - Clarifies UI/API needs
   - Checks existing patterns

3. **Guide implementation:**
   - Invokes feature-planner agent for planning
   - Uses test-generator for tests
   - Guides you through implementation
   - Validates with code-reviewer and quality-gate-checker

4. **Prepare for PR:**
   - Runs quality checks
   - Generates PR description
   - Confirms all gates pass

---

## Workflow 3: Resuming In-Progress Feature

**Scenario:** You started a feature but didn't finish it. Now you want to continue.

### Steps:

```bash
# In Claude Code chat, type:
/feature

# Claude will detect the in-progress feature
```

### What Claude Will Say:

```
Claude: I see a feature in progress: "User Profile Page"

Status:
Planning complete (feature spec created)
UI components created (UserProfile.tsx, EditProfile.tsx)
API integration in progress
Tests not yet written

Would you like to:
1. Continue the API integration
2. Start a different feature
3. Review what's been done so far

What would you prefer?
```

---

## Workflow 4: Resume Interrupted TDD Workflow

**Scenario:** The `/start` workflow was interrupted (closed VSCode, lost connection, etc.) and you want to resume from where you left off.

### Steps:

```bash
# In Claude Code chat, type:
/continue

# Claude will:
# 1. Analyze project state (wireframes, stories, tests, implementation)
# 2. Detect current phase for each epic
# 3. Show status table with resume point
# 4. Resume with the appropriate agent
```

### What Claude Will Show:

```
📋 Analyzing project state...

✅ Feature spec found: documentation/BetterBond-Commission-Payments-POC-002.md
✅ Wireframes found: 8 wireframes in generated-docs/wireframes/

📊 Epic Status:
┌────────┬──────────────────────────────────┬──────────┬────────────┐
│ Epic   │ Name                             │ Status   │ Phase      │
├────────┼──────────────────────────────────┼──────────┼────────────┤
│ Epic 1 │ Dashboard & Navigation           │ Complete │ VERIFIED   │
│ Epic 2 │ Payment Management Core          │ Progress │ IMPLEMENT  │
│ Epic 3 │ Payment Forms                    │ Planned  │ SPECIFY    │
│ Epic 4 │ Payment Allocation               │ Planned  │ SPECIFY    │
└────────┴──────────────────────────────────┴──────────┴────────────┘

📍 Current Position: Epic 2, Story 3 (Parked Payments Grid)
   - Story 1-2: ✅ Complete (tests passing)
   - Story 3: 🔄 In Progress (tests failing)
   - Story 4-5: ⏳ Not started

🚀 Resuming workflow...

Launching developer agent for Epic 2, Story 3: Parked Payments Grid
```

### When to Use `/continue`:

- You closed VSCode and want to pick up where you left off
- The TDD workflow was interrupted (error, timeout, etc.)
- You want to see the current status and resume automatically
- You're not sure which epic/story to work on next

---

## Workflow 5: Complete Feature → PR

**Scenario:** You've finished building a feature and want to create a PR.

### Steps:

```bash
# 1. Validate quality gates
# In Claude Code chat, type:
/quality-check

# 2. Claude runs all checks:
Gate 1: Functional (manual confirmation)
Gate 2: Security (npm audit, no secrets)
Gate 3: Code Quality (TypeScript, ESLint, build)
Gate 4: Testing (Vitest tests pass)
Gate 5: Performance (ready)

# 3. Create PR
git add .
git commit -m "feat: add user profile page"
git push origin feature-branch

# 4. Create PR on GitHub with quality report
# (Claude can help generate the PR description)
```

---

## TDD Workflow Execution (IMPORTANT)

**When using `/start` command for feature development:**

The TDD workflow should be executed **one epic at a time**, completing the full cycle before moving to the next epic:

```
For Epic 1:
  feature-planner → test-generator → developer → code-reviewer → quality-gate-checker

Then for Epic 2:
  feature-planner → test-generator → developer → code-reviewer → quality-gate-checker

Then for Epic 3:
  (and so on...)
```

**❌ Don't do this:**
- Generate tests for ALL epics → then implement ALL epics → then review ALL epics

**✅ Do this instead:**
- Epic 1: Plan → Test → Implement → Review → Verify → Commit/PR
- Epic 2: Plan → Test → Implement → Review → Verify → Commit/PR
- Epic 3: (repeat...)

**Why this matters:**
- ✅ Incremental value delivery (each epic is fully complete)
- ✅ Earlier feedback (issues caught per epic, not at the end)
- ✅ Better commit history (logical groupings)
- ✅ Reduced risk (working epics completed before starting next)

---

## Command Reference

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/start` | First time setup, or re-verify setup | Runs npm install + verification |
| `/continue` | Resume interrupted TDD workflow | Detects current phase and resumes with appropriate agent |
| `/feature` | Start new feature OR continue existing | Guides through AI agent workflow |
| `/quality-check` | Before creating PR | Validates all 5 quality gates |
| `/help` | Need guidance or reference | Shows help and available commands |

---

## Pro Tips

### For New Projects:
- Use `/start` once to initialize
- Then use `/feature` for each new feature
- Run `/quality-check` before every PR

### For Existing Projects:
- Just use `/feature` to add features
- Claude detects project state automatically
- No need to run `/start` again

### For Collaboration:
- Team members clone existing project
- They run `npm install` (or `/start`)
- Then use `/feature` to add their features
- All quality gates enforced for everyone

### For Context Switching:
- Claude remembers in-progress features
- Context stored in `.claude/context/`
- Safe to close and reopen VSCode
- Just type `/feature` to resume

---

## Troubleshooting

### "I ran `/start` but nothing happened"
- Check that Claude Code extension is active
- Look for the command prompt response
- Try running `npm install` manually

### "I want to start over with a feature"
- Delete files from `.claude/context/`
- Type `/feature` to start fresh

### "Claude doesn't remember my in-progress feature"
- Context files may have been deleted
- Just describe what you were building
- Claude can help pick up from where you left off

### "Quality gates are failing"
- Type `/quality-check` to see specific failures
- Claude provides fix suggestions
- Re-run after fixes applied

---

## Decision Tree

```
Are you starting a NEW project from template?
├─ YES → Use `/start` once, then `/feature` for first feature
└─ NO → Continue below

Is the project already initialized (node_modules exists)?
├─ YES → Just use `/feature` to add features
└─ NO → Run `/start` first

Do you have a feature in progress?
├─ YES → Type `/feature` and Claude will detect it
└─ NO → Type `/feature` to start a new one

Is your feature complete?
├─ YES → Type `/quality-check` then create PR
└─ NO → Continue building with Claude's guidance
```

---

**Questions?** Type `/help` or just ask Claude directly!
