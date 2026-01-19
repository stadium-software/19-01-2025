# Story: Export Incomplete ISINs

**Epic:** Epic 4: Instrument Static Data Management
**Story:** 7 of 9

## User Story

**As a** data steward
**I want** to export a list of instruments with incomplete data
**So that** I can systematically address data quality issues

## Acceptance Tests

### Happy Path
- [ ] Given I click "Export Incomplete", when export runs, then I download an Excel file
- [ ] Given I open the exported file, when I review it, then I see columns: ISIN, Name, Missing Fields, Status
- [ ] Given instruments have different missing fields, when I export, then each row shows specific gaps (e.g., "Asset Class, Maturity Date")

### Edge Cases
- [ ] Given all instruments are complete, when I click Export Incomplete, then I see "No incomplete instruments found"

### Error Handling
- [ ] Given the API fails, when I export, then I see "Export failed. Please try again."

## Implementation Notes
- API: GET /v1/instruments/incomplete (returns Excel file)
- Incomplete = missing any of: Name, Asset Class, Currency, Issuer
- File format: .xlsx with headers
