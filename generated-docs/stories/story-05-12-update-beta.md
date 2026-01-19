# Story: Update Instrument Beta

**Epic:** Epic 5: Market Data Maintenance
**Story:** 12 of 12

## User Story

**As a** risk analyst
**I want** to update beta values
**So that** I can refresh or correct beta data

## Acceptance Tests

### Happy Path
- [ ] Given I select a beta, when I click Edit, then I see the form pre-filled
- [ ] Given I change the beta value, when I save, then I see "Beta updated successfully"
- [ ] Given I update, when I save, then audit trail records the change

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to update"

## Implementation Notes
- API: PUT /v1/instrument-betas/{id}
- ISIN, Benchmark, Effective Date read-only
- Include concurrency check
