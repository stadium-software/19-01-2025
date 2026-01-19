# Story: Add Instrument Beta

**Epic:** Epic 5: Market Data Maintenance
**Story:** 11 of 12

## User Story

**As a** risk analyst
**I want** to add beta data for an instrument
**So that** portfolio risk metrics can be calculated

## Acceptance Tests

### Happy Path
- [ ] Given I click "Add Beta", when the form opens, then I see: ISIN, Benchmark, Beta, Effective Date
- [ ] Given I fill all fields, when I save, then I see "Beta added successfully"
- [ ] Given I add beta, when I save, then audit trail records it

### Edge Cases
- [ ] Given I enter duplicate (ISIN + Benchmark + Date), when I save, then I see "Beta already exists"

### Error Handling
- [ ] Given I leave required fields empty, when I save, then I see validation errors

## Implementation Notes
- API: POST /v1/instrument-betas
- ISIN dropdown from Instruments
- Benchmark dropdown from Benchmarks table
- Beta validation: typically -3 to +3 range
