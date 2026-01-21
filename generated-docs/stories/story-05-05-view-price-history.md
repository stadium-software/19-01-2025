# Story: View Index Price History

**Epic:** Epic 5: Market Data Maintenance
**Story:** 5 of 12

## User Story

**As a** portfolio analyst
**I want** to view price history for an index
**So that** I can analyze trends and verify historical data

## Acceptance Tests

### Happy Path
- [x] Given I select an index, when I click "History", then I see all prices sorted by date descending
- [x] Given I view history, when I see the list, then I see: Date, Price, Change %, User
- [x] Given I select a date range, when I apply filter, then I see prices within that range

### Edge Cases
- [x] Given an index has no history, when I view history, then I see "No historical data"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load history"

## Implementation Notes
- API: GET /v1/index-prices/history/{indexCode}
- Include chart visualization (line chart)
- Support export to Excel
