# Story: Approve at Level 1

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 2 of 16

## User Story

**As a** Level 1 approver
**I want** to approve the report batch
**So that** it can proceed to Level 2 review

## Acceptance Tests

### Happy Path
- [ ] Given I am on Level 1 approval page, when I click Approve, then I see confirmation dialog "Confirm approval for this batch?"
- [ ] Given I confirm approval, when I click Yes, then I see "Level 1 approval successful"
- [ ] Given I approve, when approval completes, then audit log records my username and timestamp

### Edge Cases
- [ ] Given the batch is already approved at L1, when I view the page, then Approve button is disabled with "Already approved" tooltip

### Error Handling
- [ ] Given the API fails, when I approve, then I see "Approval failed. Please try again."

## Implementation Notes
- API: POST /v1/approvals/level1/{batchId}/approve
- Capture username, timestamp, comments (optional)
- Update batch status to "L1_APPROVED"
