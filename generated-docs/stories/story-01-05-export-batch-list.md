# Story 1.5: Export Batch List

**Epic:** Epic 1 - Start Page & Report Batch Management
**Story:** 5 of 5
**Wireframe:** [Screen 1: Start Page (Batches List)](../wireframes/screen-01-start-page.md)

## User Story

**As a** report administrator
**I want** to export the report batch list to CSV
**So that** I can analyze batch history in Excel or share with stakeholders

## Acceptance Tests

### Happy Path
- [x] Given I am viewing the batch list, when I click the "Export to CSV" button, then a CSV file named "report-batches-{YYYY-MM-DD}.csv" downloads to my computer
- [x] Given I export the batch list, when I open the CSV file, then I see columns: Batch ID, Month, Year, Status, Created Date, Created By
- [x] Given there are 25 batches in the system, when I export the list, then the CSV contains all 25 batches (not just the current page)
- [x] Given the batch list is filtered by search, when I click "Export to CSV", then I see a confirmation: "Export all batches (25) or only filtered results (5)?"

### Export Options
- [x] Given the export confirmation dialog is shown, when I click "Export All", then the CSV contains all batches in the system
- [x] Given the export confirmation dialog is shown, when I click "Export Filtered", then the CSV contains only the batches matching my search/filter
- [x] Given I have not applied any filters, when I click "Export to CSV", then the CSV downloads immediately without confirmation dialog

### CSV Format
- [x] Given I export the batch list, when I open the CSV in Excel, then I see properly formatted dates (YYYY-MM-DD format)
- [x] Given I export the batch list, when I open the CSV, then I see status values without color codes (plain text: "In Progress", "Completed", etc.)
- [x] Given a batch has a comma in the Created By field, when I export, then the field is properly quoted in the CSV: "Smith, John"
- [x] Given I export the batch list, when I open the CSV, then the first row contains column headers

### Button States
- [x] Given I am viewing the batch list, when I hover over the "Export to CSV" button, then I see a tooltip: "Download batch list as CSV file"
- [x] Given I click "Export to CSV", when the export is in progress, then I see a spinner on the button and the button text changes to "Exporting..."
- [x] Given the export is in progress, when I view the button, then the button is disabled to prevent multiple simultaneous exports

### Edge Cases
- [x] Given there are no batches in the system, when I click "Export to CSV", then I see "No batches to export" error toast
- [x] Given there are 1000+ batches, when I export all, then I see a warning: "Large export (1000+ rows) may take a moment. Continue?" before proceeding
- [x] Given my browser blocks downloads, when I click export, then I see "Please allow downloads from this site" instruction message

### Error Handling
- [x] Given the API is unavailable, when I click "Export to CSV", then I see "Unable to export batches. Please try again later." error toast
- [x] Given the export times out, when I wait for the file, then I see "Export timed out. Try exporting fewer rows or contact support." error message
- [x] Given the API returns corrupted data, when the export completes, then I see "Export failed due to data error. Contact support." error toast

### Loading States
- [x] Given I click "Export to CSV", when the export is generating, then I see a progress indicator: "Preparing export... (Step 1 of 2)"
- [x] Given the CSV is being generated, when the file is ready, then I see "Download ready" toast notification

### File Naming
- [x] Given I export on January 15, 2024, when the file downloads, then the filename is "report-batches-2024-01-15.csv"
- [x] Given I export multiple times in one day, when the second file downloads, then the filename appends a counter: "report-batches-2024-01-15 (1).csv"

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/export?format=csv&includeFiltered={true|false}`
- **Export Logic:**
  - Server-side generation of CSV (not client-side to avoid performance issues with large datasets)
  - Stream response for large files to avoid memory issues
- **Components Needed:**
  - `Button` (shadcn/ui with loading state)
  - `AlertDialog` (shadcn/ui for export confirmation)
  - File download utility using Blob API
- **CSV Generation:**
  - Use RFC 4180 CSV standard
  - Properly escape quotes and commas
  - UTF-8 encoding with BOM for Excel compatibility
- **Security:**
  - Verify user has permission to export data
  - Audit log export actions (who exported, when, how many rows)

## Dependencies
- Story 1.1: View Report Batches List (source of data to export)

## Definition of Done
- [x] Export button downloads CSV file correctly
- [x] CSV contains all expected columns and data
- [x] Export works for both "All" and "Filtered" options
- [x] CSV opens correctly in Excel without formatting issues
- [x] Loading and error states display properly
- [x] Large exports (1000+ rows) complete successfully
- [x] Tests pass for all acceptance criteria
