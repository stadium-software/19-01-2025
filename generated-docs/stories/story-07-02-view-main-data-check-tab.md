# Story: View Main Data Check Tab

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 2 of 8

## User Story

**As an** operations lead
**I want** to verify core tables are populated
**So that** I can ensure all required data is available for calculations

## Acceptance Tests

### Happy Path
- [ ] Given I click Main Data Check tab, when the page loads, then I see: Holdings Count, Transactions Count, Income Count, Cash Count, Performance Count
- [ ] Given all tables are populated, when I view counts, then I see green checkmarks
- [ ] Given a table is empty, when I view counts, then I see red X and "0 records"

### Edge Cases
- [ ] Given holdings loaded but transactions missing, when I view, then Holdings shows green, Transactions shows red

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load data check"

## Implementation Notes
- API: GET /v1/data-confirmation/main-check
- Show record counts per portfolio
- Include "Last Updated" timestamp
