# Story: Add Custom Holding

**Epic:** Epic 6: Custom Holding Capture
**Story:** 2 of 7

## User Story

**As a** portfolio manager
**I want** to add a custom holding
**So that** I can capture positions not in standard feeds (e.g., fixed deposits)

## Acceptance Tests

### Happy Path
- [ ] Given I click "Add Holding", when the form opens, then I see: Portfolio Code (dropdown), Instrument Code (dropdown), Amount, Currency, Effective Date
- [ ] Given I fill all required fields, when I save, then I see "Custom holding added successfully"
- [ ] Given I add a holding, when I save, then audit trail records my username

### Edge Cases
- [ ] Given I enter duplicate (Portfolio + Instrument + Date), when I save, then I see "Holding already exists"

### Error Handling
- [ ] Given I leave required fields empty, when I save, then I see validation errors

## Implementation Notes
- API: POST /v1/custom-holdings
- Portfolio Code dropdown from Portfolios table
- Instrument Code dropdown from Instruments table
- Amount validation: positive number
