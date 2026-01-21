# Story: Add Instrument Duration

**Epic:** Epic 5: Market Data Maintenance
**Story:** 8 of 12

## User Story

**As a** risk analyst
**I want** to add duration data for an instrument
**So that** risk calculations can be performed

## Acceptance Tests

### Happy Path
- [x] Given I click "Add Duration", when the form opens, then I see: ISIN, Effective Date, Duration, YTM
- [x] Given I fill all fields, when I save, then I see "Duration added successfully"
- [x] Given I add duration, when I save, then audit trail records the change

### Edge Cases
- [x] Given I enter duplicate (ISIN + Date), when I save, then I see "Duration already exists"

### Error Handling
- [x] Given I leave required fields empty, when I save, then I see validation errors

## Implementation Notes
- API: POST /v1/instrument-durations
- ISIN dropdown from Instruments table
- Duration validation: positive number
- YTM validation: percentage (can be negative)
