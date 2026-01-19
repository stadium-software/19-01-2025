# Story: Export Data Confirmation Report

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 6 of 8

## User Story

**As an** operations lead
**I want** to export a data confirmation report
**So that** I can share verification status with stakeholders

## Acceptance Tests

### Happy Path
- [ ] Given I am on Data Confirmation page, when I click "Export Report", then I download an Excel file
- [ ] Given I open the export, when I review it, then I see three sheets: File Check, Main Data Check, Other Data Check
- [ ] Given I export, when I view the file, then I see timestamp and report batch date in the header

### Edge Cases
- [ ] Given export is large, when I click Export, then I see progress indicator

### Error Handling
- [ ] Given export fails, when I click Export, then I see "Export failed. Please try again."

## Implementation Notes
- API: GET /v1/data-confirmation/export (returns Excel file)
- File name format: DataConfirmation_YYYY-MM-DD_HHmm.xlsx
- Include summary sheet with overall status
