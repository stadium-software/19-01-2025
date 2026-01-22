# Story: Reject at Level 3 (Final)

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 9 of 16

## User Story

**As a** Level 3 approver
**I want** to reject with detailed reason
**So that** critical issues can be addressed

## Acceptance Tests

### Happy Path
- [x] Given I click Reject, when the dialog opens, then I see Reason text field (required, min 20 chars for L3)
- [x] Given I enter reason, when I submit, then I see "Level 3 rejection recorded"
- [x] Given I reject, when rejection completes, then batch status changes to "L3_REJECTED"

### Error Handling
- [x] Given reason is too short, when I submit, then I see "Minimum 20 characters required"

## Implementation Notes
- API: POST /v1/approvals/level3/{batchId}/reject
- L3 rejections require more detailed reason (20+ chars)
- Returns workflow to "PREPARE_DATA"
