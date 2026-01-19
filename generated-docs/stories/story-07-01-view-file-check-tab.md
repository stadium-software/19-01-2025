# Story: View File Check Tab

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 1 of 8

## User Story

**As an** operations lead
**I want** to view expected vs actual file counts
**So that** I can verify all required data files have been received

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Data Confirmation, when I click File Check tab, then I see sections: Asset Managers, Bloomberg, Custodian
- [ ] Given I view File Check, when all files are received, then I see green checkmarks next to each file type
- [ ] Given I view File Check, when a file is missing, then I see red X and "Missing" status

### Edge Cases
- [ ] Given no files have been uploaded, when I view File Check, then all statuses show "Missing"

### Error Handling
- [ ] Given the API fails, when I load File Check, then I see "Failed to load file status"

## Implementation Notes
- API: GET /v1/data-confirmation/file-check
- Expected file counts configured per report batch type
- Color coding: Green (complete), Red (missing), Yellow (partial)
