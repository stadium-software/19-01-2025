# Story 2.5: Cancel In-Progress Import

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 5 of 7
**Wireframe:** [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to cancel an in-progress file import
**So that** I can stop processing if I uploaded the wrong file or notice an issue

## Acceptance Tests

### Happy Path
- [x] Given a file cell has status "Processing", when I click the "Cancel" button, then I see a confirmation dialog: "Cancel file import? Processing will stop and data will not be saved."
- [x] Given the cancel confirmation is shown, when I click "Yes, cancel import", then I see "Canceling import..." message
- [x] Given I confirm cancellation, when the cancellation completes, then I see "Import canceled successfully" toast notification
- [x] Given the import is canceled, when I view the file cell, then the status changes to "Pending" with the "Upload" button visible
- [x] Given the import is canceled, when I view the grid, then no partial data is saved (clean rollback)

### Cancellation in Different Stages
- [x] Given the file is uploading (0-100% progress), when I click "Cancel", then the upload stops and the file is not saved
- [x] Given the file is validating (after upload, before import), when I click "Cancel", then validation stops and the file is deleted from temp storage
- [x] Given the file is importing data (rows being inserted), when I click "Cancel", then the transaction rolls back and no data is saved

### Confirmation Dialog
- [x] Given the cancel confirmation is shown, when I click "No, continue processing", then the dialog closes and import continues
- [x] Given the dialog is open, when I press Escape, then the dialog closes and import continues (safer default)
- [x] Given the dialog is open, when I click outside the dialog, then the dialog closes and import continues

### Real-Time Status Updates
- [x] Given I confirm cancellation, when the system is stopping the import, then I see progress updates: "Canceling... (stopping background job)"
- [x] Given cancellation is in progress, when I view the file cell, then I see a spinner with text "Canceling..."
- [x] Given cancellation takes longer than 5 seconds, when I wait, then I see "Cancellation in progress. This may take a moment..." message

### Edge Cases
- [x] Given I click "Cancel" just as the import finishes, when the cancellation is processed, then I see "Import already completed. Cannot cancel." info toast
- [x] Given I click "Cancel" multiple times rapidly, when the system processes the requests, then only one cancellation is processed (idempotent)
- [x] Given the import is at 99% completion, when I cancel, then the system still rolls back all data (no partial imports)

### Error Handling
- [x] Given the API is unavailable during cancellation, when I click "Cancel", then I see "Unable to cancel import. Please try again or contact support." error toast
- [x] Given the background job cannot be stopped, when cancellation times out, then I see "Cancellation failed. Job may complete. Verify status and re-import if needed." error message
- [x] Given the rollback fails, when cancellation completes, then I see "Cancellation incomplete. Data may be inconsistent. Contact support." critical error toast

### Audit Trail
- [x] Given I cancel an import, when I view the file logs, then I see an entry: "Import canceled by [User Name] at [timestamp]"
- [x] Given I cancel an import, when I view the audit trail, then I see the cancellation reason (if provided in future enhancement)

### Multiple Concurrent Imports
- [x] Given multiple files are processing simultaneously, when I cancel one import, then only that specific import is canceled and others continue
- [x] Given I cancel a file import, when I view other processing files, then their "Cancel" buttons remain active and functional

### Button State During Cancellation
- [x] Given I click "Cancel", when the cancellation is processing, then the "Cancel" button is disabled and shows "Canceling..." text
- [x] Given cancellation is in progress, when I view the button, then I see a spinner icon instead of the cancel icon
- [x] Given cancellation completes, when I view the file cell, then the "Upload" button appears (ready to retry)

## Implementation Notes
- **API Endpoint:** `POST /v1/report-batches/{batchId}/portfolio-files/{fileId}/cancel`
- **Request:** Empty body or optional cancellation reason
- **Response:**
  ```typescript
  interface CancelResponse {
    success: boolean;
    message: string;
    fileStatus: 'Pending' | 'Canceled';
  }
  ```
- **Components Needed:**
  - `AlertDialog` (shadcn/ui for cancellation confirmation)
  - `Button` (shadcn/ui with loading state for "Cancel" button)
  - `Toast` (shadcn/ui for success/error notifications)
- **Backend Job Cancellation:**
  - Set cancellation flag in job queue
  - Background worker checks flag periodically (every 1 second)
  - Rollback transaction if job is canceled mid-process
  - Delete temp files
- **Rollback Strategy:**
  - Use database transactions for atomic rollback
  - Delete uploaded file from storage
  - Reset file status to "Pending"
  - Log cancellation in audit trail

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (displays "Cancel" button for processing files)
- Story 2.2: Upload Portfolio File (creates processing jobs that can be canceled)

## Definition of Done
- [x] Cancel button appears for files with status "Processing"
- [x] Cancellation confirmation dialog prevents accidental cancellations
- [x] Cancellation stops import and rolls back partial data
- [x] File status updates to "Pending" after cancellation
- [x] Audit trail logs cancellation action
- [x] Error handling covers network failures and timeout scenarios
- [x] Tests pass for all acceptance criteria
