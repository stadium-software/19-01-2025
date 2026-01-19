# Story: Update Index Price

**Epic:** Epic 5: Market Data Maintenance
**Story:** 3 of 12

## User Story

**As a** market data analyst
**I want** to update an index price
**So that** I can correct pricing errors

## Acceptance Tests

### Happy Path
- [ ] Given I select a price, when I click Edit, then I see the form pre-filled
- [ ] Given I change the price, when I save, then I see "Price updated successfully"
- [ ] Given I update a price, when I save, then the audit trail records the change

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to update. Please try again."

## Implementation Notes
- API: PUT /v1/index-prices/{id}
- Index Code and Date should be read-only (not editable)
- Include optimistic concurrency check
