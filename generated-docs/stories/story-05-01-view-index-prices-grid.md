# Story: View Index Prices Grid

**Epic:** Epic 5: Market Data Maintenance
**Story:** 1 of 12

## User Story

**As a** market data analyst
**I want** to view index prices in a searchable grid
**So that** I can review current pricing and identify missing data

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Index Prices page, when the page loads, then I see a grid with: Index Code, Name, Date, Price, Currency
- [ ] Given I am on the grid, when I click a column header, then the grid sorts by that column
- [ ] Given I search for an index, when I type in the search box, then matching rows are filtered

### Edge Cases
- [ ] Given no prices exist, when I load the page, then I see "No index prices found"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load index prices. Please try again."

## Implementation Notes
- API: GET /v1/index-prices
- Include date range filter (default: last 30 days)
- Support export to Excel
