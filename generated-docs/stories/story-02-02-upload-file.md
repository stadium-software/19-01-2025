# Story 2.2: Upload Portfolio File

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 2 of 7
**Wireframe:** [Screen 2.1: File Import Popup](../wireframes/screen-02-1-file-import-popup.md)

## User Story

**As a** report administrator
**I want** to upload a portfolio file via the File Import Popup
**So that** the system can validate and import the data for processing

## Acceptance Tests

### Happy Path
- [x] Given I am viewing a file cell with status "Pending", when I click the "Upload" button, then I see the File Import Popup modal open
- [x] Given the File Import Popup is open, when I view the modal, then I see the title "Upload [File Type] for [Portfolio Name]" (e.g., "Upload Holdings for Portfolio A")
- [x] Given the popup is open, when I view the form, then I see a file upload dropzone with text "Drag & drop file here, or click to browse"
- [x] Given I drag a valid CSV file into the dropzone, when I drop the file, then I see the file name displayed with a green checkmark icon
- [x] Given I have selected a file, when I click "Upload & Process", then I see "Uploading file..." progress indicator
- [x] Given the file uploads successfully, when the upload completes, then I see "File uploaded successfully. Processing..." toast notification
- [x] Given the upload completes, when the modal closes, then I see the file cell status change to "Processing" with a spinner icon

### File Selection Methods
- [x] Given the popup is open, when I click the "Browse" button, then I see the system file picker dialog
- [x] Given the file picker is open, when I select a CSV file and click "Open", then the file name appears in the dropzone
- [x] Given the dropzone is visible, when I drag a file over it, then I see the dropzone highlight with a blue border
- [x] Given I drag an invalid file type (e.g., .pdf), when I drop it, then I see "Invalid file type. Please upload CSV or Excel files only." error message

### File Validation
- [x] Given I select a CSV file larger than 50MB, when I drop the file, then I see "File size exceeds 50MB limit. Please upload a smaller file." error message
- [x] Given I select an Excel file with macros, when I drop the file, then I see "Excel files with macros are not supported. Please upload .xlsx files only." error message
- [x] Given I select a valid file, when I view the popup, then I see the file size displayed (e.g., "2.5 MB")
- [x] Given I select a file, when I view the popup, then I see a "Remove" button to deselect the file

### Processing Options
- [x] Given I have selected a file, when I view the form, then I see a checkbox: "Validate only (do not import data)"
- [x] Given I check "Validate only", when I upload the file, then the system validates the file structure but does not import data
- [x] Given validation-only mode is enabled, when validation passes, then I see "Validation passed. No errors found." success message and the file cell status remains "Pending"
- [x] Given I upload with validation-only unchecked, when the upload completes, then the file is validated AND imported

### Upload Progress
- [x] Given I click "Upload & Process", when the upload is in progress, then I see a progress bar showing percentage complete (e.g., "45% uploaded")
- [x] Given the file is large, when I view the progress, then I see estimated time remaining (e.g., "30 seconds remaining")
- [x] Given the upload is in progress, when I click "Cancel", then I see "Are you sure? Upload will be aborted." confirmation dialog

### Edge Cases
- [x] Given I select a file with no file extension, when I drop the file, then I see "Unable to determine file type. Please use .csv or .xlsx files." error message
- [x] Given I select an empty file (0 bytes), when I drop the file, then I see "File is empty. Please select a valid file." error message
- [x] Given I select a file with special characters in the name (e.g., "file@#$.csv"), when I upload, then the system sanitizes the file name and uploads successfully

### Error Handling
- [x] Given the API is unavailable, when I click "Upload & Process", then I see "Unable to upload file. Please try again later." error toast
- [x] Given the upload times out, when I wait for completion, then I see "Upload timed out. Please check your connection and try again." error message
- [x] Given the server rejects the file format, when I upload, then I see the specific error message from the server (e.g., "Invalid CSV structure on row 5")

### Loading States
- [x] Given I click "Upload & Process", when the upload starts, then the button text changes to "Uploading..." and the button is disabled
- [x] Given the upload is in progress, when I view the modal, then I cannot close it by clicking outside or pressing Escape

### Modal Interaction
- [x] Given the popup is open with no file selected, when I click "Cancel", then the modal closes and no upload occurs
- [x] Given I have selected a file but not uploaded, when I click "Cancel", then I see "File not uploaded. Close anyway?" confirmation dialog
- [x] Given the confirmation is shown, when I click "Yes, close", then the modal closes and the file is discarded

## Implementation Notes
- **API Endpoint:** `POST /v1/report-batches/{batchId}/portfolio-files/upload`
- **Request:** Multipart form data with file and metadata
  ```
  FormData:
    file: [File object]
    portfolioId: string
    fileType: string (holdings|transactions|cashFlow|benchmark|performance|risk|compliance)
    validateOnly: boolean
  ```
- **Components Needed:**
  - `FileImportPopup` (modal dialog)
  - `FileDropzone` (drag-and-drop upload component)
  - `Progress` (shadcn/ui progress bar)
  - `Checkbox` (shadcn/ui for validate-only option)
- **File Validation:**
  - Client-side: File type (.csv, .xlsx), size (max 50MB)
  - Server-side: CSV structure, required columns, data types
- **Upload Strategy:**
  - Use chunked upload for files > 10MB
  - Show progress updates every 5%
  - Support resume for interrupted uploads

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (source of "Upload" button)

## Definition of Done
- [x] File Import Popup opens with correct title and portfolio/file type context
- [x] Drag-and-drop and browse file selection both work
- [x] File validation rejects invalid files with clear error messages
- [x] Upload progress displays correctly
- [x] File cell status updates to "Processing" after successful upload
- [x] Loading and error states display properly
- [x] Tests pass for all acceptance criteria
