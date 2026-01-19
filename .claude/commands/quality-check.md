---
description: Run all 5 quality gates to verify code is ready for PR
model: haiku
---

You are helping a developer validate that their code passes all quality gates before creating a pull request.

## Quality Gates Overview

There are 5 quality gates that must pass:

1. **Gate 1 - Functional**: Feature works as expected (manual testing)
2. **Gate 2 - Security**: No vulnerabilities, no hardcoded secrets
3. **Gate 3 - Code Quality**: TypeScript compiles, ESLint passes, builds successfully
4. **Gate 4 - Testing**: Vitest tests written and passing
5. **Gate 5 - Performance**: Page loads reasonably fast

## Step 1: Run Automated Checks

Run these checks **in parallel** for efficiency:

```bash
# Gate 2 - Security
npm audit

# Gate 3 - Code Quality
npx tsc --noEmit
npm run lint
npm run build

# Gate 4 - Testing
npm test
```

## Step 2: Manual Verification Prompts

For gates that require manual verification:

**Gate 1 - Functional:**
Ask the user: "Have you manually tested the feature? Does it work as expected?"

**Gate 5 - Performance:**
Ask the user: "Have you checked performance? (You can test locally if needed)"

## Step 3: Generate Quality Gate Report

Create a formatted report showing results:

```markdown
# Quality Gate Report

## Gate 1: Functional Completeness
Manual testing confirmed by developer

## Gate 2: Security Review
npm audit: 0 vulnerabilities
No hardcoded secrets detected

## Gate 3: Code Quality
TypeScript: No errors
ESLint: Passed
Build: Successful

## Gate 4: Testing
Vitest tests: X passed, 0 failed

## Gate 5: Performance
Will be validated manually or in CI

---

**Status**: Ready for Pull Request

All automated quality gates passed. You can safely create a PR!
```

## Step 4: Handle Failures

If any gate fails:
- Clearly show which gate failed and why
- Provide specific fix suggestions
- Offer to help fix the issues
- Re-run checks after fixes

## Step 5: Next Steps

If all gates pass:
- Suggest creating a pull request
- Offer to generate PR description with quality gate report
- Remind them that GitHub Actions will verify again

## Important Notes

- Be encouraging even if gates fail - failures are learning opportunities
- Provide actionable fix suggestions, not just error messages
- If only minor issues (like ESLint warnings), note they're non-blocking
- Track which gates passed/failed for metrics
