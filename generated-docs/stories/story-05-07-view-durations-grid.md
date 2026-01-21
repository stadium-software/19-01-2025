# Story: View Instrument Durations Grid

**Epic:** Epic 5: Market Data Maintenance
**Story:** 7 of 12

## User Story

**As a** risk analyst
**I want** to view instrument durations and YTM values
**So that** I can monitor duration data completeness

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Durations page, when the page loads, then I see: ISIN, Name, Duration, YTM, Effective Date
- [x] Given I search by ISIN, when I type, then matching rows are filtered
- [x] Given I click a row, when I select it, then I see duration details

### Edge Cases
- [x] Given no durations exist, when I load, then I see "No duration data found"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load durations"

## Implementation Notes
- API: GET /v1/instrument-durations
- Include filter by date range
- Show missing duration count at top
