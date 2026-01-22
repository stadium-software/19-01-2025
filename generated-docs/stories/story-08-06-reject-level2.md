# Story: Reject at Level 2

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 6 of 16

## User Story

**As a** Level 2 approver
**I want** to reject the batch with a reason
**So that** issues can be addressed

## Acceptance Tests

### Happy Path
- [x] Given I click Reject, when the dialog opens, then I see Reason text field (required)
- [x] Given I enter reason, when I submit, then I see "Level 2 rejection recorded"
- [x] Given I reject, when rejection completes, then batch status changes to "L2_REJECTED"

### Error Handling
- [x] Given reason is empty, when I submit, then I see "Rejection reason required"

## Implementation Notes
- API: POST /v1/approvals/level2/{batchId}/reject
- Returns workflow to "PREPARE_DATA"
