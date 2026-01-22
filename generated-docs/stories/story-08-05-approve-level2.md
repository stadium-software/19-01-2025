# Story: Approve at Level 2

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 5 of 16

## User Story

**As a** Level 2 approver
**I want** to approve the batch
**So that** it can proceed to Level 3 final review

## Acceptance Tests

### Happy Path
- [x] Given I am on Level 2 approval page, when I click Approve, then I see confirmation dialog
- [x] Given I confirm, when I approve, then I see "Level 2 approval successful"
- [x] Given I approve, when approval completes, then batch status updates to "L2_APPROVED"

### Error Handling
- [x] Given the API fails, when I approve, then I see "Approval failed"

## Implementation Notes
- API: POST /v1/approvals/level2/{batchId}/approve
- Update batch status to "L2_APPROVED"
- Record audit trail
