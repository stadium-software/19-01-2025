# Story: View Instrument Betas Grid

**Epic:** Epic 5: Market Data Maintenance
**Story:** 10 of 12

## User Story

**As a** risk analyst
**I want** to view instrument beta values
**So that** I can monitor beta coverage for risk calculations

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Betas page, when the page loads, then I see: ISIN, Name, Beta, Benchmark, Effective Date
- [x] Given I search by ISIN, when I type, then matching rows filter
- [x] Given I click a row, when I select it, then I see beta details

### Edge Cases
- [x] Given no betas exist, when I load, then I see "No beta data found"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load betas"

## Implementation Notes
- API: GET /v1/instrument-betas
- Include filter by benchmark
- Show missing beta count
