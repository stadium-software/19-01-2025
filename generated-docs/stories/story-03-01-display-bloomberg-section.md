# Story 3.1: Display Bloomberg Files Section

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 1 of 6
**Wireframe:** [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view Bloomberg file types and their upload status
**So that** I can track which market data files have been imported

## Acceptance Tests

### Happy Path
- [x] Given I navigate to the Other Files dashboard, when the page loads, then I see a section titled "Bloomberg Files"
- [x] Given I view the Bloomberg section, when I look at the file types, then I see rows for: Security Master, Prices, Credit Ratings, Analytics
- [x] Given I view a Bloomberg file row, when I look at the columns, then I see: File Type, File Name, Upload Date, Status, Actions
- [x] Given a Bloomberg file has been uploaded, when I view the row, then I see the file name, upload date, and status icon

### Status Indicators
- [x] Given a Bloomberg file has status "Success", when I view the row, then I see a green checkmark icon
- [x] Given a Bloomberg file has status "Warning", when I view the row, then I see a yellow exclamation icon
- [x] Given a Bloomberg file has status "Failed", when I view the row, then I see a red X icon
- [x] Given a Bloomberg file has status "Pending", when I view the row, then I see a gray clock icon
- [x] Given a Bloomberg file has status "Processing", when I view the row, then I see a blue animated spinner icon

### File Metadata
- [x] Given a Bloomberg file was uploaded by "Jane Doe" on "2024-01-15", when I view the row, then I see "Uploaded by J. Doe on 01/15/24"
- [x] Given a Bloomberg file name is longer than 30 characters, when I view the row, then the name is truncated with ellipsis
- [x] Given I hover over a truncated file name, when I view the tooltip, then I see the full file name

### Action Buttons
- [x] Given a Bloomberg file has status "Pending", when I view the row, then I see an "Upload" button
- [x] Given a Bloomberg file has status "Success", when I view the row, then I see a "Re-import" button
- [x] Given a Bloomberg file has status "Warning" or "Failed", when I view the row, then I see "View Errors" and "Re-import" buttons
- [x] Given a Bloomberg file has status "Processing", when I view the row, then I see a "Cancel" button

### Section Collapsing
- [x] Given the Bloomberg section is visible, when I click the section header, then the section collapses and I see only the header with a "collapsed" indicator
- [x] Given the Bloomberg section is collapsed, when I click the header, then the section expands showing all file rows

### Edge Cases
- [x] Given no Bloomberg files have been uploaded, when I view the section, then all rows show status "Pending" with "Upload" buttons
- [x] Given all Bloomberg files have status "Success", when I view the section, then the section header shows a green checkmark icon

### Loading States
- [x] Given I navigate to the dashboard, when Bloomberg data is loading, then I see skeleton loaders for each file row
- [x] Given the page is loading, when I view the Bloomberg section, then I see "Loading Bloomberg files..." text

### Error Handling
- [x] Given the API is unavailable, when I view the Bloomberg section, then I see "Unable to load Bloomberg files. Please try again later." error message

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/other-files?category=bloomberg`
- **Response Model:**
  ```typescript
  interface BloombergFilesResponse {
    files: Array<{
      fileType: 'SecurityMaster' | 'Prices' | 'CreditRatings' | 'Analytics';
      status: 'Pending' | 'Processing' | 'Success' | 'Warning' | 'Failed';
      fileName?: string;
      uploadedBy?: string;
      uploadedAt?: string;
      errorCount?: number;
    }>;
  }
  ```
- **Components Needed:**
  - `FileSectionCard` (collapsible card for Bloomberg section)
  - `FileRow` (row component with status, metadata, and actions)
  - `StatusIcon` (icon component based on status)
  - `Badge` (shadcn/ui for status indicators)

## Dependencies
- Epic 2, Story 2.7: Navigate to Other Files (navigation source)

## Definition of Done
- [x] Bloomberg section displays with correct title
- [x] All 4 Bloomberg file types are listed
- [x] Status icons render with correct colors
- [x] File metadata displays correctly
- [x] Action buttons appear based on file status
- [x] Section can collapse/expand
- [x] Loading and error states render properly
- [x] Tests pass for all acceptance criteria
