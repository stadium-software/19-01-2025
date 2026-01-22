# Story: View Level 2 Approval Page

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 4 of 16

## User Story

**As a** Level 2 approver
**I want** to view the approval page
**So that** I can review portfolio-level checks before approval

## Acceptance Tests

### Happy Path
- [x] Given Level 1 is approved, when I navigate to Level 2 approval, then I see: Report Summary, Level 1 Approval Details (who/when), Portfolio-Level Checks
- [x] Given all checks pass, when I view the page, then I see Approve and Reject buttons enabled
- [x] Given I am a Level 2 approver, when I view the page, then I see approval controls

### Edge Cases
- [x] Given Level 1 is not approved, when I access Level 2, then I see "Level 1 approval required first"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load approval data"

## Implementation Notes
- API: GET /v1/approvals/level2/{batchId}
- Role check: APPROVER_L2 or ADMIN
- Prerequisite: L1 must be approved
