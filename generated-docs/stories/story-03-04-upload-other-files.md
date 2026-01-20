# Story 3.4: Upload/Re-import Other Files

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 4 of 6
**Wireframe:** [Screen 2.1: File Import Popup](../wireframes/screen-02-1-file-import-popup.md) (reused)

## User Story

**As a** report administrator
**I want** to upload or re-import Bloomberg, Custodian, and Additional files
**So that** I can populate market data and reconciliation information

## Acceptance Tests

### Happy Path
- [x] Given I click "Upload" on a Bloomberg file, when the popup opens, then I see the title "Upload [File Type] - Bloomberg"
- [x] Given I select a file and click "Upload & Process", when the upload completes, then the file status changes to "Processing"
- [x] Given I click "Re-import" on a Custodian file, when the popup opens, then I see the warning: "This will replace existing data"
- [x] Given I upload a valid CSV file, when processing completes, then the status changes to "Success"

### File Validation
- [x] Given I upload a Bloomberg Prices file, when the system validates it, then it checks for required columns: InstrumentCode, Date, Price
- [x] Given I upload a Custodian Holdings file, when validation runs, then it checks for matching portfolio holdings
- [x] Given validation fails, when I view errors, then I see specific row/column error messages

### Reuse File Import Popup
- [x] Given I click Upload/Re-import on any Other File, when the popup opens, then it uses the same File Import Popup component from Epic 2
- [x] Given the popup is open, when I view the form, then I see drag-and-drop, browse button, and progress bar (same UI as Portfolio Files)

### Edge Cases
- [x] Given I upload a Bloomberg file with 100,000+ rows, when processing starts, then I see "Large file detected. Processing may take several minutes."

## Implementation Notes
- **API Endpoint:** `POST /v1/report-batches/{batchId}/other-files/upload`
- **Components:** Reuse `FileImportPopup` from Story 2.2 with `fileCategory` prop
- **Validation Rules:**
  - Bloomberg files: Check ISIN format, price > 0, valid dates
  - Custodian files: Match against portfolio holdings
  - Additional files: Basic structure checks only

## Dependencies
- Story 2.2: Upload Portfolio File (reuses File Import Popup component)
- Stories 3.1-3.3: Display file sections (Upload button source)

## Definition of Done
- [x] Upload works for Bloomberg, Custodian, and Additional files
- [x] File Import Popup is reused successfully
- [x] Validation enforces category-specific rules
- [x] Tests pass for all acceptance criteria
