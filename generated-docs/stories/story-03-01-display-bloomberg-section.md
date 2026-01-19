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
- [ ] Given I navigate to the Other Files dashboard, when the page loads, then I see a section titled "Bloomberg Files"
- [ ] Given I view the Bloomberg section, when I look at the file types, then I see rows for: Security Master, Prices, Credit Ratings, Analytics
- [ ] Given I view a Bloomberg file row, when I look at the columns, then I see: File Type, File Name, Upload Date, Status, Actions
- [ ] Given a Bloomberg file has been uploaded, when I view the row, then I see the file name, upload date, and status icon

### Status Indicators
- [ ] Given a Bloomberg file has status "Success", when I view the row, then I see a green checkmark icon
- [ ] Given a Bloomberg file has status "Warning", when I view the row, then I see a yellow exclamation icon
- [ ] Given a Bloomberg file has status "Failed", when I view the row, then I see a red X icon
- [ ] Given a Bloomberg file has status "Pending", when I view the row, then I see a gray clock icon
- [ ] Given a Bloomberg file has status "Processing", when I view the row, then I see a blue animated spinner icon

### File Metadata
- [ ] Given a Bloomberg file was uploaded by "Jane Doe" on "2024-01-15", when I view the row, then I see "Uploaded by J. Doe on 01/15/24"
- [ ] Given a Bloomberg file name is longer than 30 characters, when I view the row, then the name is truncated with ellipsis
- [ ] Given I hover over a truncated file name, when I view the tooltip, then I see the full file name

### Action Buttons
- [ ] Given a Bloomberg file has status "Pending", when I view the row, then I see an "Upload" button
- [ ] Given a Bloomberg file has status "Success", when I view the row, then I see a "Re-import" button
- [ ] Given a Bloomberg file has status "Warning" or "Failed", when I view the row, then I see "View Errors" and "Re-import" buttons
- [ ] Given a Bloomberg file has status "Processing", when I view the row, then I see a "Cancel" button

### Section Collapsing
- [ ] Given the Bloomberg section is visible, when I click the section header, then the section collapses and I see only the header with a "collapsed" indicator
- [ ] Given the Bloomberg section is collapsed, when I click the header, then the section expands showing all file rows

### Edge Cases
- [ ] Given no Bloomberg files have been uploaded, when I view the section, then all rows show status "Pending" with "Upload" buttons
- [ ] Given all Bloomberg files have status "Success", when I view the section, then the section header shows a green checkmark icon

### Loading States
- [ ] Given I navigate to the dashboard, when Bloomberg data is loading, then I see skeleton loaders for each file row
- [ ] Given the page is loading, when I view the Bloomberg section, then I see "Loading Bloomberg files..." text

### Error Handling
- [ ] Given the API is unavailable, when I view the Bloomberg section, then I see "Unable to load Bloomberg files. Please try again later." error message

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
- [ ] Bloomberg section displays with correct title
- [ ] All 4 Bloomberg file types are listed
- [ ] Status icons render with correct colors
- [ ] File metadata displays correctly
- [ ] Action buttons appear based on file status
- [ ] Section can collapse/expand
- [ ] Loading and error states render properly
- [ ] Tests pass for all acceptance criteria
