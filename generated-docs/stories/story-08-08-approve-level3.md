# Story: Approve at Level 3 (Final)

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 8 of 16

## User Story

**As a** Level 3 approver
**I want** to give final approval
**So that** the batch can be published

## Acceptance Tests

### Happy Path
- [ ] Given I am on Level 3 page, when I click Approve, then I see confirmation "This is final approval. Confirm?"
- [ ] Given I confirm, when I approve, then I see "Level 3 approval successful - Batch complete"
- [ ] Given I approve, when approval completes, then batch status updates to "APPROVED_FINAL"

### Error Handling
- [ ] Given the API fails, when I approve, then I see "Approval failed"

## Implementation Notes
- API: POST /v1/approvals/level3/{batchId}/approve
- Update batch status to "APPROVED_FINAL"
- Trigger any post-approval processes (reports, notifications)
