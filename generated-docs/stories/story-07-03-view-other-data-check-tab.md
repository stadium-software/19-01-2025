# Story: View Other Data Check Tab

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 3 of 8

## User Story

**As an** operations lead
**I want** to view incomplete records across reference tables
**So that** I can identify data gaps before approval

## Acceptance Tests

### Happy Path
- [ ] Given I click Other Data Check tab, when the page loads, then I see: Incomplete Instruments, Missing Index Prices, Missing Durations, Missing Betas, Missing Credit Ratings
- [ ] Given all reference data is complete, when I view counts, then I see "0 incomplete" for all categories
- [ ] Given instruments are incomplete, when I view counts, then I see "X incomplete instruments" with clickable link

### Edge Cases
- [ ] Given I click "X incomplete instruments", when I click, then I navigate to Instruments page filtered to incomplete records

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load other checks"

## Implementation Notes
- API: GET /v1/data-confirmation/other-check
- Each count should be clickable link to filtered view
- Color coding: Green (0), Yellow (1-10), Red (>10)
