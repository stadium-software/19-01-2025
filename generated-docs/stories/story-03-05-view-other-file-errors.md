# Story 3.5: View File Validation Errors

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 5 of 6
**Wireframe:** [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view detailed validation errors for Bloomberg, Custodian, and Additional files
**So that** I can identify and fix data issues

## Acceptance Tests

### Happy Path
- [x] Given a Bloomberg file has status "Failed", when I click "View Errors", then I see the Error Details modal
- [x] Given the modal is open, when I view errors, then I see columns: Row Number, Column, Error Message, Severity
- [x] Given a Custodian reconciliation fails, when I view errors, then I see "Mismatch: Portfolio Holdings = 100 shares, Custodian = 95 shares"

### Category-Specific Errors
- [x] Given a Bloomberg Prices file has invalid ISINs, when I view errors, then I see "Invalid ISIN format on row 5: Column 'ISIN', Value: 'ABC123'"
- [x] Given a Custodian Holdings file has reconciliation discrepancies, when I view errors, then I see a summary: "10 holdings matched, 3 discrepancies, 2 missing"
- [x] Given an Additional file has schema errors, when I view errors, then I see "Missing required column: 'Currency'"

### Export Errors
- [x] Given I am viewing errors, when I click "Export Errors", then a CSV downloads with file category in the name: "Bloomberg-Prices-errors-2024-01-15.csv"

### Reuse Error Modal
- [x] Given I click "View Errors" on any Other File, when the modal opens, then it uses the same Error Details modal from Epic 2 Story 2.4

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/other-files/{fileId}/errors`
- **Components:** Reuse `ErrorDetailsModal` from Story 2.4

## Dependencies
- Story 2.4: View File Import Errors (reuses Error Details modal)
- Story 3.4: Upload Other Files (generates errors)

## Definition of Done
- [x] Error modal displays errors for Bloomberg, Custodian, and Additional files
- [x] Category-specific validation messages are clear
- [x] Export Errors works with correct file naming
- [x] Tests pass for all acceptance criteria
