# Story 2.4: View File Import Errors

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 4 of 7
**Wireframe:** [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view detailed error messages for failed or warning-status files
**So that** I can identify and fix data quality issues before proceeding

## Acceptance Tests

### Happy Path
- [ ] Given a file cell has status "Failed", when I click the "View Errors" button, then I see the Error Details modal open
- [ ] Given the Error Details modal is open, when I view the content, then I see the modal title: "Errors for [File Type] - [Portfolio Name]" (e.g., "Errors for Holdings - Portfolio A")
- [ ] Given I am viewing errors, when I look at the error list, then I see columns: Row Number, Column, Error Message, Severity
- [ ] Given there are 50 errors, when I view the list, then I see the first 20 errors with a "Load More" button
- [ ] Given I click "Load More", when more errors load, then I see the next 20 errors appended to the list

### Error Severity Indicators
- [ ] Given an error has severity "Critical", when I view the error row, then I see a red badge with "Critical" label
- [ ] Given an error has severity "Warning", when I view the error row, then I see a yellow badge with "Warning" label
- [ ] Given an error has severity "Info", when I view the error row, then I see a blue badge with "Info" label

### Error Categorization
- [ ] Given there are multiple error types, when I view the modal, then I see a summary at the top: "25 Critical errors, 10 Warnings, 5 Info messages"
- [ ] Given I am viewing errors, when I click the "Filter by Severity" dropdown, then I see options: All, Critical, Warning, Info
- [ ] Given I select "Critical" filter, when the list updates, then I see only errors with severity "Critical"

### Error Details
- [ ] Given an error row displays "Row 5, Column 'Price', Error: 'Invalid number format'", when I view the error, then I see exactly which row and column has the issue
- [ ] Given an error message is long, when I view the error, then the message wraps to multiple lines for readability
- [ ] Given I click on an error row, when the row expands, then I see the full row data from the file: "Original value: 'abc123', Expected: Numeric value"

### Export Errors
- [ ] Given I am viewing errors, when I click the "Export Errors" button, then a CSV file named "[FileType]-[Portfolio]-errors-{date}.csv" downloads
- [ ] Given I export errors, when I open the CSV, then I see columns: Row Number, Column, Error Message, Severity, Original Value
- [ ] Given there are 500+ errors, when I export, then the CSV contains all errors (not just the visible 20)

### Edge Cases
- [ ] Given a file has status "Warning" with 0 critical errors, when I view errors, then I see only warnings and info messages
- [ ] Given a file has status "Success" with 0 errors, when I view the grid, then the "View Errors" button is not displayed
- [ ] Given a file has 1000+ errors, when I open the modal, then I see a warning: "Large number of errors detected. Consider fixing source file and re-importing."

### Error Context
- [ ] Given an error references a missing column, when I view the error, then the message includes the expected column name: "Required column 'InstrumentCode' not found"
- [ ] Given an error is a duplicate row, when I view the error, then the message shows both row numbers: "Duplicate of row 3"
- [ ] Given an error is a validation failure, when I view the error, then the message includes the validation rule: "Price must be positive. Got: -100"

### Error Handling
- [ ] Given the API is unavailable, when I click "View Errors", then I see "Unable to load errors. Please try again later." error toast
- [ ] Given the error data is corrupted, when the modal opens, then I see "Error data unavailable. Contact support." error message

### Loading States
- [ ] Given I click "View Errors", when the modal is loading, then I see skeleton loaders for the error list
- [ ] Given I click "Load More", when additional errors are loading, then I see a spinner on the button with text "Loading more..."

### Modal Interaction
- [ ] Given the Error Details modal is open, when I click the "Close" button, then the modal closes and I return to the file grid
- [ ] Given the modal is open, when I press the Escape key, then the modal closes
- [ ] Given the modal is open, when I click outside the modal, then the modal closes

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/portfolio-files/{fileId}/errors?page={page}&severity={severity}`
- **Response Model:**
  ```typescript
  interface FileErrorResponse {
    summary: {
      totalErrors: number;
      criticalCount: number;
      warningCount: number;
      infoCount: number;
    };
    errors: Array<{
      rowNumber: number;
      column: string;
      message: string;
      severity: 'Critical' | 'Warning' | 'Info';
      originalValue?: string;
      expectedFormat?: string;
    }>;
    hasMore: boolean;
  }
  ```
- **Components Needed:**
  - `ErrorDetailsModal` (dialog with error list)
  - `ErrorRow` (expandable row component)
  - `Badge` (shadcn/ui for severity indicators)
  - `Select` (shadcn/ui for severity filter)
  - `Button` (shadcn/ui for Load More and Export)
- **Pagination:**
  - Load 20 errors at a time
  - Use "Load More" pattern instead of pagination for better UX
- **Export Format:**
  - CSV with all error details
  - Include file metadata in header (file name, portfolio, import date)

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (source of "View Errors" button)
- Story 2.2: Upload Portfolio File (generates errors during validation)

## Definition of Done
- [ ] Error Details modal opens with correct file context
- [ ] Error list displays row number, column, message, and severity
- [ ] Severity filter works correctly
- [ ] Export Errors downloads CSV with all errors
- [ ] Load More pagination works for large error sets
- [ ] Loading and error states display properly
- [ ] Tests pass for all acceptance criteria
