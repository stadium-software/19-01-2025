# Story: Filter Custom Holdings by Portfolio

**Epic:** Epic 6: Custom Holding Capture
**Story:** 7 of 7

## User Story

**As a** portfolio manager
**I want** to filter custom holdings by portfolio
**So that** I can focus on positions for a specific fund

## Acceptance Tests

### Happy Path
- [ ] Given I am on the custom holdings grid, when I select a portfolio from dropdown, then I see only holdings for that portfolio
- [ ] Given I select "All Portfolios", when I apply, then I see all holdings
- [ ] Given I apply a filter, when I refresh the page, then the filter persists

### Edge Cases
- [ ] Given a portfolio has no custom holdings, when I filter by it, then I see "No holdings found for this portfolio"

### Error Handling
- [ ] Given the portfolio dropdown fails to load, when I open it, then I see "Failed to load portfolios"

## Implementation Notes
- Portfolio dropdown from Portfolios table
- Store filter preference in localStorage
- Support multi-select for multiple portfolios
