# Story: Update Existing Instrument

**Epic:** Epic 4: Instrument Static Data Management
**Story:** 3 of 9

## User Story

**As a** data steward
**I want** to update instrument details
**So that** I can correct errors or reflect changes in instrument attributes

## Acceptance Tests

### Happy Path
- [ ] Given I select an instrument, when I click Edit, then I see the update form pre-filled with current values
- [ ] Given I change any field, when I save, then I see "Instrument updated successfully"
- [ ] Given I update an instrument, when I save, then the audit trail records the change

### Edge Cases
- [ ] Given I clear a required field, when I save, then I see "Field is required" validation error
- [ ] Given another user updated the same instrument, when I save, then I see a concurrency conflict warning

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to update instrument. Please try again."

## Implementation Notes
- API: PUT /v1/instruments/{id}
- Form should disable ISIN field (not editable after creation)
- Include optimistic concurrency check (version/timestamp)
