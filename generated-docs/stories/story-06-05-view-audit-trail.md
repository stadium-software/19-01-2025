# Story: View Custom Holding Audit Trail

**Epic:** Epic 6: Custom Holding Capture
**Story:** 5 of 7

## User Story

**As a** compliance officer
**I want** to view audit trail for custom holdings
**So that** I can track who added or changed manual positions

## Acceptance Tests

### Happy Path
- [ ] Given I select a holding, when I click "Audit Trail", then I see chronological list of changes
- [ ] Given I view audit trail, when I see a record, then I see: Date, User, Action (Add/Update/Delete), Changes
- [ ] Given I view audit trail, when I click Export, then I download Excel file

### Edge Cases
- [ ] Given a holding has no changes, when I view audit, then I see "No changes recorded"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load audit trail"

## Implementation Notes
- API: GET /v1/custom-holdings/{id}/audit-trail
- Sort by timestamp descending
- Include filter by user and date range
