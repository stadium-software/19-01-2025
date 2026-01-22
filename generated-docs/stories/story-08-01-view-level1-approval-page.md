# Story: View Level 1 Approval Page

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 1 of 16

## User Story

**As a** Level 1 approver
**I want** to view the approval summary page
**So that** I can review data quality before approval

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Approve Level 1, when the page loads, then I see: Report Batch Date, Overall Status, Data Summary (file counts, record counts)
- [x] Given data confirmation is complete, when I view the page, then I see green "Ready for Approval" status
- [x] Given I am a Level 1 approver, when I view the page, then I see Approve and Reject buttons

### Edge Cases
- [x] Given I am not a Level 1 approver, when I access the page, then I see "Access Denied"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load approval data"

## Implementation Notes
- API: GET /v1/approvals/level1/{batchId}
- Role check: APPROVER_L1 or ADMIN
- Show summary from Data Confirmation
