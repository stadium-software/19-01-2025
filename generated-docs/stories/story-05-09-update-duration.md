# Story: Update Instrument Duration

**Epic:** Epic 5: Market Data Maintenance
**Story:** 9 of 12

## User Story

**As a** risk analyst
**I want** to update duration data
**So that** I can correct errors or refresh stale data

## Acceptance Tests

### Happy Path
- [ ] Given I select a duration, when I click Edit, then I see the form pre-filled
- [ ] Given I change duration or YTM, when I save, then I see "Duration updated successfully"
- [ ] Given I update, when I save, then audit trail records the change

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to update"

## Implementation Notes
- API: PUT /v1/instrument-durations/{id}
- ISIN and Effective Date read-only
- Include concurrency check
