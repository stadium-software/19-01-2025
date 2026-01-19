# Story 2.3: Re-import Portfolio File

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 3 of 7
**Wireframe:** [Screen 2.1: File Import Popup](../wireframes/screen-02-1-file-import-popup.md)

## User Story

**As a** report administrator
**I want** to re-import a portfolio file to replace existing data
**So that** I can correct errors or update data with a new file version

## Acceptance Tests

### Happy Path
- [ ] Given a file cell has status "Success", when I click the "Re-import" button, then I see the File Import Popup modal open with title "Re-import [File Type] for [Portfolio Name]"
- [ ] Given the Re-import popup is open, when I view the modal, then I see a warning banner: "This will replace the existing file. Previous data will be overwritten."
- [ ] Given the popup is open, when I view the form, then I see the current file name displayed: "Current file: holdings_jan2024.csv (uploaded 01/15/24)"
- [ ] Given I select a new file, when I click "Upload & Process", then I see "Re-importing file..." progress indicator
- [ ] Given the re-import completes successfully, when the modal closes, then I see "File re-imported successfully" toast notification
- [ ] Given the re-import completes, when I view the grid, then the file cell shows the new file name and upload date

### Confirmation Warning
- [ ] Given the Re-import popup is open, when I select a file and click "Upload & Process", then I see a confirmation dialog: "Are you sure you want to replace the existing file? This action cannot be undone."
- [ ] Given the confirmation dialog is shown, when I click "Yes, replace", then the upload proceeds
- [ ] Given the confirmation dialog is shown, when I click "Cancel", then the dialog closes and no upload occurs

### Version History (Optional Feature)
- [ ] Given a file has been imported multiple times, when I open the Re-import popup, then I see a "View History" link
- [ ] Given I click "View History", when the history modal opens, then I see a list of previous file versions with upload date, uploaded by, and status
- [ ] Given I am viewing file history, when I click "Download" next to a previous version, then the old file downloads to my computer

### File Comparison (Optional Feature)
- [ ] Given I select a new file for re-import, when I check the "Compare with existing" checkbox, then I see a preview showing differences (rows added/removed/changed)
- [ ] Given the comparison shows 100+ rows changed, when I view the preview, then I see "100+ changes detected. Full comparison available after import."

### Edge Cases
- [ ] Given a file cell has status "Warning", when I click "Re-import", then the popup opens and allows me to upload a corrected file
- [ ] Given a file cell has status "Failed", when I click "Re-import", then the popup opens with the warning banner and allows re-upload
- [ ] Given I upload the exact same file again, when the upload completes, then I see "File is identical to previous version. No changes detected." info message

### Error Handling
- [ ] Given the re-import fails due to server error, when I view the result, then I see "Re-import failed. Original file remains unchanged." error toast
- [ ] Given the re-import validation fails, when I view the errors, then I see "Validation failed. Original file remains unchanged. View errors for details." error toast
- [ ] Given the re-import times out, when I wait for completion, then I see "Re-import timed out. Please try again. Original file remains unchanged." error message

### Rollback Protection
- [ ] Given a re-import is in progress, when I view the file cell, then the status shows "Processing (re-import)" to distinguish from initial import
- [ ] Given a re-import fails midway, when I view the grid, then the file cell reverts to the previous status (Success/Warning) with the original file
- [ ] Given a re-import is processing, when another user tries to re-import the same file, then they see "File is currently being re-imported. Please wait." error message

### Loading States
- [ ] Given I click "Upload & Process" in re-import mode, when the upload starts, then the button text changes to "Re-importing..." and the button is disabled
- [ ] Given the re-import is in progress, when I view the progress bar, then I see the percentage and "Re-importing file..." label

## Implementation Notes
- **API Endpoint:** `POST /v1/report-batches/{batchId}/portfolio-files/reimport`
- **Request:** Multipart form data with file and metadata
  ```
  FormData:
    file: [File object]
    portfolioId: string
    fileType: string
    previousFileId: string (for rollback if needed)
  ```
- **Components Needed:**
  - `FileImportPopup` (reused from Story 2.2 with re-import mode)
  - `AlertDialog` (shadcn/ui for confirmation warning)
  - `Badge` (shadcn/ui for "Current file" display)
- **Rollback Strategy:**
  - Keep previous file in database until new import succeeds
  - Use transaction to ensure atomic replacement
  - Log re-import action in audit trail
- **Version History (if implemented):**
  - Store up to 10 previous versions per file
  - Auto-delete versions older than 90 days

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (source of "Re-import" button)
- Story 2.2: Upload Portfolio File (reuses File Import Popup component)

## Definition of Done
- [ ] Re-import popup opens with warning banner
- [ ] Confirmation dialog prevents accidental overwrites
- [ ] Re-import replaces existing file successfully
- [ ] Rollback protection prevents data loss on failure
- [ ] File history (if implemented) displays previous versions
- [ ] Loading and error states display properly
- [ ] Tests pass for all acceptance criteria
