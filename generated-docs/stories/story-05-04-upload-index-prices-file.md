# Story: Upload Index Prices File

**Epic:** Epic 5: Market Data Maintenance
**Story:** 4 of 12

## User Story

**As a** market data analyst
**I want** to upload a bulk index prices file
**So that** I can efficiently update multiple prices at once

## Acceptance Tests

### Happy Path
- [ ] Given I click "Upload File", when I select a valid file, then I see file name displayed
- [ ] Given I upload a valid file, when processing completes, then I see "X prices added, Y updated"
- [ ] Given upload succeeds, when I view the grid, then new prices appear

### Edge Cases
- [ ] Given the file has invalid prices (negative), when validation runs, then I see error list

### Error Handling
- [ ] Given I upload wrong format, when I submit, then I see "Invalid file format"

## Implementation Notes
- API: POST /v1/index-prices/upload
- File format: .xlsx or .csv
- Expected columns: IndexCode, Date, Price, Currency
