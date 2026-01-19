# Quality Gate Enforcement Policy

## Core Principle

Quality gates are **objective, automated checks**. They either **pass** or **fail**. There are **NO exceptions, caveats, or conditional passes**.

---

## Gate Definitions

### Gate 1: Functional Completeness
**Type:** Manual verification
**Pass Criteria:** User confirms feature works as specified

### Gate 2: Security
**Type:** Automated
**Commands:**
- `npm audit`

**Pass Criteria:**
- 0 high or critical vulnerabilities
- No hardcoded secrets

### Gate 3: Code Quality
**Type:** Automated
**Commands:**
- `npx tsc --noEmit` (TypeScript)
- `npm run lint` (ESLint)
- `npm run build` (Build)

**Pass Criteria:**

| Check | Pass | Fail |
|-------|------|------|
| TypeScript | Exit code 0 | Any non-zero exit code |
| ESLint | 0 errors (warnings OK) | 1+ errors |
| Build | Successful | Build fails |

**NO EXCEPTIONS** for:
- "Expected errors from TDD"
- "Future story test files"
- "Will be fixed later"

### Gate 4: Testing
**Type:** Automated
**Commands:**
- `npm test`

**Pass Criteria:**
- All tests pass (0 failures)
- Coverage ≥ 80% (if configured)

### Gate 5: Performance
**Type:** Manual verification
**Pass Criteria:** User confirms reasonable performance

---

## Reporting Results

### ✅ Correct Reporting

```markdown
## Gate 3: Code Quality ❌ FAIL

**Automated Checks:**
- TypeScript: 30 errors
- ESLint: 3 errors, 15 warnings
- Build: ✅ Success

**Why it failed:**
Test files for Stories 2-6 reference components that don't exist yet (TDD workflow).

**Options to proceed:**
1. **Skip failing tests** - Comment out tests for unimplemented stories to pass the gate
2. **Proceed with failed gate** - Continue implementation knowing gates will fail until stories complete (requires your approval)

Which approach would you prefer?
```

### ❌ Incorrect Reporting (NEVER DO THIS)

```markdown
## Gate 3: Code Quality ✅ PASS

TypeScript has errors but they're expected from TDD, so this passes.
```

```markdown
## Gate 3: Code Quality ⚠️ CONDITIONAL PASS

Story 1 code itself is clean, so we can proceed.
```

```markdown
## Gate 3: Code Quality ✅ PASS with notes

There are errors in future story tests but that's acceptable.
```

**Why these are wrong:**
- They report "PASS" when the check **actually failed** (non-zero exit code)
- They make the decision for the user instead of presenting options
- They rationalize failures as acceptable without user input

---

## TDD Workflow and Quality Gates

### The Challenge

In Test-Driven Development:
1. Tests are written **before** implementation
2. Test files import components that don't exist yet
3. TypeScript and ESLint report errors
4. These errors are **expected** but still **fail the quality gate**

### Two Valid Approaches

#### Option A: Green Build Approach ✅ (Recommended)

**How it works:**
- Test-generator creates tests with `.skip()` or comments
- Each story uncomments/enables its tests during implementation
- Quality gates **always pass** (clean build)

**Pros:**
- CI/CD friendly
- Clear pass/fail status
- No confusion about gate failures

**Cons:**
- Tests aren't "truly" written before implementation
- Requires discipline to uncomment tests

#### Option B: Red-Green-Refactor TDD

**How it works:**
- All tests written upfront (fully uncommented)
- Quality gates **FAIL** until epic is complete
- User accepts failing gates as expected

**Pros:**
- True TDD workflow
- All tests visible from start

**Cons:**
- Confusing (gates fail even when nothing is wrong)
- Requires CI/CD configuration
- Easy to miss real failures

### User Must Choose

**The /start command MUST ask:**
> "For quality gates: Would you like (A) Green Build Approach where tests are skipped until implementation, or (B) Red-Green-Refactor TDD where all tests are written upfront and gates fail until complete?
>
> Recommendation: Option A for easier CI/CD integration."

**Agents MUST NOT:**
- Choose an approach without asking
- Switch approaches mid-project
- Report failed gates as "conditional passes"

---

## Agent Responsibilities

### When Running Quality Gates

1. **Run all checks** - Don't skip any
2. **Report facts** - Exit codes, error counts, actual results
3. **Be binary** - Each gate either passes or fails
4. **Present options** - When gates fail, show remediation choices
5. **Let user decide** - Don't make the decision to proceed despite failures

### What Agents MUST Say

When Gate 3 fails due to TDD test files:

```markdown
Gate 3: Code Quality ❌ FAIL

The automated checks found:
- TypeScript: 30 errors in test files for Stories 2-6
- ESLint: 3 errors in test files for Stories 2-6
- Build: ✅ Successful

These errors are expected in TDD (tests reference unimplemented components).

**Your options:**
1. Comment out failing tests now, uncomment during implementation
2. Proceed with failed gate (I'll continue despite this)
3. Stop and discuss the best approach

Which would you prefer?
```

### What Agents MUST NOT Say

❌ "Gate 3 passes because Story 1 code is clean"
❌ "Conditional pass - errors are expected"
❌ "PASS with notes"
❌ "The errors don't count because TDD"

---

## Examples

### Example 1: All Gates Pass

```markdown
# Quality Gate Report ✅

## Gate 1: Functional ✅
Manual testing confirmed

## Gate 2: Security ✅
npm audit: 0 vulnerabilities

## Gate 3: Code Quality ✅
- TypeScript: 0 errors
- ESLint: 0 errors
- Build: Success

## Gate 4: Testing ✅
Tests: 15 passed, 0 failed

## Gate 5: Performance ✅
Verified by user

**Status: Ready for PR**
```

### Example 2: Gate 3 Fails (TDD Tests)

```markdown
# Quality Gate Report ❌

## Gate 1: Functional ✅
Manual testing confirmed

## Gate 2: Security ✅
npm audit: 0 vulnerabilities

## Gate 3: Code Quality ❌ FAIL
- TypeScript: 30 errors (test files for Stories 2-6)
- ESLint: 3 errors (test files for Stories 2-6)
- Build: ✅ Success

**Cause:** Test files for unimplemented stories reference non-existent components (expected in TDD).

**Options:**
1. Skip/comment failing tests to pass gate
2. Proceed with failed gate (your approval needed)

## Gate 4: Testing ✅
Tests: 15 passed (Story 1 only)

## Gate 5: Performance ✅
Verified by user

**Status: NOT Ready for PR** (Gate 3 failed)

Which option do you prefer?
```

### Example 3: Real TypeScript Error

```markdown
# Quality Gate Report ❌

## Gate 1: Functional ✅
Manual testing confirmed

## Gate 2: Security ✅
npm audit: 0 vulnerabilities

## Gate 3: Code Quality ❌ FAIL
- TypeScript: 1 error in `dashboard/page.tsx:42`
  - Error: Property 'foo' does not exist on type 'DashboardData'
- ESLint: 0 errors
- Build: ❌ Failed

**This is a REAL error that must be fixed before PR.**

## Gate 4: Testing ❌ FAIL
Tests: 14 passed, 1 failed
- Failed: "dashboard renders metrics correctly"

## Gate 5: Performance ⏳
Not yet verified

**Status: NOT Ready for PR** (Gates 3 & 4 failed)

**Required fixes:**
1. Fix TypeScript error in `dashboard/page.tsx:42`
2. Fix failing test after code fix
3. Re-run quality gates

Would you like help fixing these issues?
```

---

## Summary

Quality gates are binary. They pass or they fail. When they fail, agents must:
1. Report the failure honestly
2. Explain why it failed
3. Present options to the user
4. Let the user decide next steps

**Never rationalize a failure as a pass.** That undermines the entire purpose of quality gates.
