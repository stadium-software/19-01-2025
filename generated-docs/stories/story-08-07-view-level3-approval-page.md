# Story: View Level 3 Approval Page

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 7 of 16

## User Story

**As a** Level 3 approver
**I want** to view final approval page
**So that** I can perform final sign-off

## Acceptance Tests

### Happy Path
- [x] Given Level 2 is approved, when I navigate to Level 3, then I see: Full Report Summary, L1 & L2 Approval Details, Final Checks
- [x] Given all checks pass, when I view, then I see Approve and Reject buttons
- [x] Given I am a Level 3 approver, when I view, then I see approval controls

### Edge Cases
- [x] Given L2 is not approved, when I access L3, then I see "Level 2 approval required first"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load"

## Implementation Notes
- API: GET /v1/approvals/level3/{batchId}
- Role check: APPROVER_L3 or ADMIN
- Show full approval chain
