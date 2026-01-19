# Story: Add New Instrument

**Epic:** Epic 4: Instrument Static Data Management
**Story:** 2 of 9

## User Story

**As a** data steward
**I want** to add a new instrument with required static data fields
**So that** holdings can be properly classified and reported

## Acceptance Tests

### Happy Path
- [ ] Given I click "Add Instrument", when the form opens, then I see fields: ISIN (required), Name, Asset Class, Currency, Issuer, Maturity Date
- [ ] Given I fill all required fields, when I click Save, then I see "Instrument added successfully" and the instrument appears in the grid
- [ ] Given I add an instrument, when I save, then the audit trail records my username and timestamp

### Edge Cases
- [ ] Given I enter a duplicate ISIN, when I save, then I see "ISIN already exists" error
- [ ] Given I leave required fields empty, when I click Save, then I see validation errors for missing fields

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to add instrument. Please try again."
- [ ] Given I click Cancel, when I confirm, then the form closes without saving

## Implementation Notes
- API: POST /v1/instruments
- Form validation: ISIN format (12 alphanumeric), required fields
- Dropdowns for Asset Class, Currency from reference tables
- Audit trail automatically captures LastChangedUser
