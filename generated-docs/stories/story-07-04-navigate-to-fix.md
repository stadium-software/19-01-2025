# Story: Navigate to Fix Data Gaps

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 4 of 8

## User Story

**As an** operations lead
**I want** to click incomplete data counts to navigate to fix screens
**So that** I can efficiently resolve data quality issues

## Acceptance Tests

### Happy Path
- [ ] Given I see "12 incomplete instruments", when I click the link, then I navigate to Instruments page with filter: Status = Incomplete
- [ ] Given I see "5 missing index prices", when I click, then I navigate to Index Prices page
- [ ] Given I fix an issue and return to Data Confirmation, when I refresh, then the count decreases

### Edge Cases
- [ ] Given the count is 0, when I view it, then the link is disabled (not clickable)

### Error Handling
- [ ] Given navigation fails, when I click, then I see "Failed to navigate. Please try again."

## Implementation Notes
- Use deep linking with query params (e.g., /instruments?status=incomplete)
- Include "Back to Data Confirmation" breadcrumb
- Auto-refresh counts every 30 seconds
