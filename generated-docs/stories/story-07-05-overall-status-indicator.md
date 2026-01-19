# Story: Overall Confirmation Status Indicator

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 5 of 8

## User Story

**As an** operations lead
**I want** to see an overall status indicator
**So that** I can quickly determine if data is ready for approval

## Acceptance Tests

### Happy Path
- [ ] Given all checks pass, when I view Data Confirmation, then I see "Ready for Approval" badge in green at the top
- [ ] Given any check fails, when I view Data Confirmation, then I see "Issues Found - Review Required" badge in red
- [ ] Given checks are in progress, when I view, then I see "In Progress" badge in yellow

### Edge Cases
- [ ] Given I fix all issues, when I refresh, then the status changes from red to green

### Error Handling
- [ ] Given status calculation fails, when I load, then I see "Unable to determine status"

## Implementation Notes
- Status calculated based on all three tabs (File Check, Main Data Check, Other Data Check)
- Badge should be prominent at top of page
- Include summary text: "3 files missing, 12 incomplete instruments"
