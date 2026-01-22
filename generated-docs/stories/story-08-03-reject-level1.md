# Story: Reject at Level 1

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 3 of 16

## User Story

**As a** Level 1 approver
**I want** to reject the batch with a reason
**So that** the team can address issues before re-submission

## Acceptance Tests

### Happy Path
- [x] Given I am on Level 1 approval page, when I click Reject, then I see a dialog with "Reason" text field (required)
- [x] Given I enter a rejection reason, when I submit, then I see "Level 1 rejection recorded"
- [x] Given I reject, when rejection completes, then batch status changes to "L1_REJECTED"

### Edge Cases
- [x] Given I leave reason blank, when I submit, then I see "Rejection reason is required"

### Error Handling
- [x] Given the API fails, when I reject, then I see "Rejection failed. Please try again."

## Implementation Notes
- API: POST /v1/approvals/level1/{batchId}/reject
- Reason is required (min 10 characters)
- Rejection returns workflow to "PREPARE_DATA" status
