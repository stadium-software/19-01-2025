# Story: View Price Popup

**Epic:** Epic 5: Market Data Maintenance
**Story:** 6 of 12

## User Story

**As a** user reviewing data
**I want** to view index price details in a popup
**So that** I can quickly check information without navigating away

## Acceptance Tests

### Happy Path
- [x] Given I click an index row, when the popup opens, then I see: Index Code, Name, Current Price, Previous Price, Change %
- [x] Given I view the popup, when I click "View History", then I navigate to history page
- [x] Given I click outside, when I click, then the popup closes

### Error Handling
- [x] Given the API fails, when I open popup, then I see "Failed to load details"

## Implementation Notes
- API: GET /v1/index-prices/{id}
- Popup should be modal overlay
- Include Edit button if user has permissions
