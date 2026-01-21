# Story: Add Index Price

**Epic:** Epic 5: Market Data Maintenance
**Story:** 2 of 12

## User Story

**As a** market data analyst
**I want** to manually add an index price
**So that** I can fill gaps when automated feeds are unavailable

## Acceptance Tests

### Happy Path
- [x] Given I click "Add Price", when the form opens, then I see fields: Index Code, Date, Price, Currency
- [x] Given I fill all fields, when I save, then I see "Price added successfully"
- [x] Given I add a price, when I save, then the audit trail records my username

### Edge Cases
- [x] Given I enter a duplicate (Index + Date), when I save, then I see "Price already exists for this date"

### Error Handling
- [x] Given I leave required fields empty, when I save, then I see validation errors

## Implementation Notes
- API: POST /v1/index-prices
- Index Code dropdown from Indexes table
- Date picker (cannot be future date)
- Price validation: must be positive number
