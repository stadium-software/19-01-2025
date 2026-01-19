# Story: Disable Approval When Incomplete

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 8 of 8

## User Story

**As a** system administrator
**I want** approval buttons to be disabled when data confirmation fails
**So that** users cannot approve batches with incomplete data

## Acceptance Tests

### Happy Path
- [ ] Given data confirmation shows issues, when I navigate to Approve Level 1, then the Approve button is disabled with tooltip "Complete data confirmation first"
- [ ] Given all checks pass, when I navigate to Approve Level 1, then the Approve button is enabled
- [ ] Given I fix all issues, when I return to approval page, then the button becomes enabled

### Edge Cases
- [ ] Given I am on approval page when data becomes incomplete, when status changes, then the button disables immediately

### Error Handling
- [ ] Given I try to approve via API directly, when data is incomplete, then the API returns 400 error "Data confirmation incomplete"

## Implementation Notes
- API: GET /v1/data-confirmation/status (returns boolean ready_for_approval)
- Tooltip should show specific issues count (e.g., "3 files missing, 12 instruments incomplete")
- Approval endpoints should validate data confirmation server-side
