# Story: View User Audit Trail

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 6 of 14

## User Story

**As a** compliance officer
**I want** to view user actions audit trail
**So that** I can track who did what and when

## Acceptance Tests

### Happy Path
- [ ] Given I am on Weekly Process Logs page, when I view User Audit Trail grid, then I see: User, Action, Entity, Timestamp, Details
- [ ] Given I filter by user, when I apply filter, then I see actions for that user only
- [ ] Given I search by entity, when I type, then matching actions filter

### Edge Cases
- [ ] Given no user actions occurred, when I view, then I see "No user actions recorded"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load audit trail"

## Implementation Notes
- API: GET /v1/user-audit-trail?batchDate={date}
- Capture all CRUD operations
- Include before/after values for updates
