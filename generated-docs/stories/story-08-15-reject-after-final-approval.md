# Story: Reject After Final Approval

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 15 of 16

## User Story

**As a** Level 3 approver
**I want** to reject a batch after final approval
**So that** I can address critical issues discovered post-approval

## Acceptance Tests

### Happy Path
- [x] Given a batch is fully approved (L3), when I navigate to Reject Final Reports, then I see the batch in the list
- [x] Given I select a batch, when I click Reject, then I see Reason dialog (required, min 30 chars)
- [x] Given I enter reason and confirm, when I submit, then I see "Batch rejected - returned to preparation"

### Edge Cases
- [x] Given reason is too short, when I submit, then I see "Minimum 30 characters required for post-approval rejection"

### Error Handling
- [x] Given the API fails, when I reject, then I see "Rejection failed"

## Implementation Notes
- API: POST /v1/approvals/reject-final/{batchId}
- Role check: APPROVER_L3 or ADMIN only
- Requires more detailed reason than regular rejections
- Returns batch to "PREPARE_DATA" status
