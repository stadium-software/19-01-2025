# Story: Update Custom Holding

**Epic:** Epic 6: Custom Holding Capture
**Story:** 3 of 7

## User Story

**As a** portfolio manager
**I want** to update a custom holding
**So that** I can correct amounts or attributes

## Acceptance Tests

### Happy Path
- [ ] Given I select a holding, when I click Edit, then I see the form pre-filled
- [ ] Given I change the amount, when I save, then I see "Holding updated successfully"
- [ ] Given I update, when I save, then audit trail records the change

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to update"

## Implementation Notes
- API: PUT /v1/custom-holdings/{id}
- Portfolio and Instrument read-only
- Include concurrency check
