# Story 1.2: Create New Report Batch

**Epic:** Epic 1 - Start Page & Report Batch Management
**Story:** 2 of 5
**Wireframe:** [Screen 1: Start Page (Batches List)](../wireframes/screen-01-start-page.md)

## User Story

**As a** report administrator
**I want** to create a new monthly report batch with month/year selection and optional SFTP auto-import
**So that** I can initiate the monthly reporting workflow

## Acceptance Tests

### Happy Path
- [ ] Given I am on the Start Page, when I click the "New Batch" button, then I see a modal titled "Create New Report Batch"
- [ ] Given the Create Batch modal is open, when I view the form, then I see fields: Month (dropdown), Year (dropdown), Auto-import from SFTP (checkbox)
- [ ] Given I select Month = "January" and Year = "2024", when I click "Create Batch", then I see "Report batch for January 2024 created successfully" toast notification
- [ ] Given I create a new batch, when the batch is created, then I see the new batch appear at the top of the batch list with Status = "Pending"
- [ ] Given I create a batch with Auto-import enabled, when the batch is created, then I see Status = "In Progress" and a background job starts

### Form Validation
- [ ] Given the Create Batch modal is open, when I click "Create Batch" without selecting Month, then I see "Month is required" error message
- [ ] Given the Create Batch modal is open, when I click "Create Batch" without selecting Year, then I see "Year is required" error message
- [ ] Given I select Month = "January" and Year = "2024", when a batch for January 2024 already exists, then I see "A batch for January 2024 already exists" error message
- [ ] Given all required fields are filled, when I uncheck Auto-import, then no validation error appears

### Modal Interaction
- [ ] Given the Create Batch modal is open, when I click "Cancel", then the modal closes and no batch is created
- [ ] Given the Create Batch modal is open, when I click outside the modal, then the modal closes and no batch is created
- [ ] Given I have entered form data, when I click "Cancel", then I see "Are you sure? Unsaved changes will be lost." confirmation dialog
- [ ] Given the confirmation dialog is shown, when I click "Yes, discard changes", then the modal closes

### Dropdown Options
- [ ] Given the Create Batch modal is open, when I click the Month dropdown, then I see all 12 months (January - December)
- [ ] Given the Create Batch modal is open, when I click the Year dropdown, then I see years from current year - 5 to current year + 1
- [ ] Given the current date is March 2024, when the modal opens, then Month defaults to "March" and Year defaults to "2024"

### Auto-Import Checkbox
- [ ] Given the Create Batch modal is open, when I check "Auto-import from SFTP", then I see helper text: "Files will be imported automatically from configured SFTP server"
- [ ] Given Auto-import is checked, when I create the batch, then the batch status is set to "In Progress"
- [ ] Given Auto-import is unchecked, when I create the batch, then the batch status is set to "Pending"

### Edge Cases
- [ ] Given I create a batch for December 2024, when the batch is created, then the next suggested batch defaults to January 2025
- [ ] Given there are 50+ batches, when I create a new batch, then pagination resets to page 1 showing the new batch

### Error Handling
- [ ] Given the API is unavailable, when I click "Create Batch", then I see "Unable to create batch. Please try again later." error toast
- [ ] Given the API returns a 500 error, when I submit the form, then I see the error message from the API response
- [ ] Given the API times out, when I submit the form, then I see "Request timed out. Please try again." error toast

### Loading States
- [ ] Given I click "Create Batch", when the API request is in progress, then I see a spinner on the button and the button text changes to "Creating..."
- [ ] Given the batch is being created, when I view the button, then the button is disabled to prevent double-submission

## Implementation Notes
- **API Endpoint:** `POST /v1/report-batches`
- **Request Body:**
  ```json
  {
    "month": "January",
    "year": 2024,
    "autoImport": true
  }
  ```
- **Components Needed:**
  - `CreateBatchModal` (dialog with form)
  - `Select` (shadcn/ui for Month/Year dropdowns)
  - `Checkbox` (shadcn/ui for Auto-import)
  - `Button` (shadcn/ui with loading state)
- **Validation:**
  - Client-side: Zod schema for month (1-12), year (YYYY), autoImport (boolean)
  - Server-side: Check for duplicate month/year combination
- **Background Job:**
  - If autoImport = true, trigger SFTP import job and update batch status to "In Progress"

## Dependencies
- Story 1.1: View Report Batches List (new batch must appear in list)

## Definition of Done
- [ ] Modal opens with all form fields
- [ ] Form validation works for all required fields
- [ ] Batch creation succeeds with valid data
- [ ] New batch appears in batch list immediately
- [ ] Auto-import checkbox triggers background job
- [ ] Loading and error states display correctly
- [ ] Tests pass for all acceptance criteria
