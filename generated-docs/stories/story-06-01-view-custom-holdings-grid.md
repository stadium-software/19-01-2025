# Story: View Custom Holdings Grid

**Epic:** Epic 6: Custom Holding Capture
**Story:** 1 of 7

## User Story

**As a** portfolio manager
**I want** to view all custom holdings in a grid
**So that** I can review manually-entered positions like fixed deposits

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Custom Holdings page, when the page loads, then I see: Portfolio, ISIN, Description, Amount, Currency, Effective Date
- [ ] Given I search by portfolio, when I type, then matching rows filter
- [ ] Given I click a row, when I select it, then I see full holding details

### Edge Cases
- [ ] Given no custom holdings exist, when I load, then I see "No custom holdings found"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load custom holdings"

## Implementation Notes
- API: GET /v1/custom-holdings
- Include filter by portfolio and date range
- Support export to Excel
