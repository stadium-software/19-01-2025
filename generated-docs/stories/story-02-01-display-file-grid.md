# Story 2.1: Display Portfolio File Status Grid

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 1 of 7
**Wireframe:** [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view the status of all portfolio file types in a grid layout
**So that** I can quickly identify which files need attention

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to the Portfolio Files dashboard, when the page loads, then I see a grid with columns for each of 7 file types: Holdings, Transactions, Cash Flow, Benchmark, Performance, Risk, Compliance
- [ ] Given I am viewing the grid, when I look at a portfolio row, then I see the portfolio name in the leftmost column
- [ ] Given I am viewing the grid, when I look at each file cell, then I see a status icon (Success: green checkmark, Warning: yellow exclamation, Failed: red X, Pending: gray clock, Processing: blue spinner)
- [ ] Given a file has been uploaded, when I view the cell, then I see the file name below the status icon
- [ ] Given a file has been uploaded, when I view the cell, then I see the upload date in small text (e.g., "2024-01-15 10:30 AM")

### Multi-Portfolio Display
- [ ] Given there are 5 portfolios in the batch, when the page loads, then I see 5 rows in the grid (one per portfolio)
- [ ] Given there are 10+ portfolios, when the page loads, then I see all portfolios without pagination (scrollable grid)
- [ ] Given portfolios are listed, when I view the grid, then portfolios are sorted alphabetically by name

### Status Icons and Colors
- [ ] Given a file has status "Success", when I view the cell, then I see a green checkmark icon with green background tint
- [ ] Given a file has status "Warning", when I view the cell, then I see a yellow exclamation icon with yellow background tint and "View Errors" button
- [ ] Given a file has status "Failed", when I view the cell, then I see a red X icon with red background tint and "View Errors" button
- [ ] Given a file has status "Pending", when I view the cell, then I see a gray clock icon with neutral background and "Upload" button
- [ ] Given a file has status "Processing", when I view the cell, then I see a blue animated spinner icon and "Cancel" button

### File Metadata Display
- [ ] Given a file has been uploaded, when I view the cell, then I see the uploaded file name truncated if longer than 20 characters with ellipsis
- [ ] Given I hover over a truncated file name, when I view the tooltip, then I see the full file name
- [ ] Given a file was uploaded by "John Smith" on "2024-01-15 at 10:30 AM", when I view the cell, then I see "Uploaded by J. Smith on 01/15/24"

### Action Buttons per File Status
- [ ] Given a file has status "Pending", when I view the cell, then I see an "Upload" button
- [ ] Given a file has status "Success", when I view the cell, then I see a "Re-import" button
- [ ] Given a file has status "Warning", when I view the cell, then I see "View Errors" and "Re-import" buttons
- [ ] Given a file has status "Failed", when I view the cell, then I see "View Errors" and "Re-import" buttons
- [ ] Given a file has status "Processing", when I view the cell, then I see a "Cancel" button

### Edge Cases
- [ ] Given no portfolios exist in the batch, when the page loads, then I see "No portfolios found for this batch. Please configure portfolios first."
- [ ] Given a portfolio has no files uploaded, when I view the row, then all cells show "Pending" status with "Upload" buttons
- [ ] Given all files for a portfolio are "Success", when I view the row, then the row has a green left border indicator

### Error Handling
- [ ] Given the API is unavailable, when the page loads, then I see "Unable to load file status. Please try again later." error message
- [ ] Given the API returns corrupted data, when the page loads, then I see "Data error. Contact support." error toast

### Loading States
- [ ] Given I navigate to the dashboard, when data is loading, then I see skeleton loaders for each grid cell
- [ ] Given the page is loading, when I view the screen, then I see "Loading portfolio files..." text

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/portfolio-files`
- **Response Model:**
  ```typescript
  interface PortfolioFileGrid {
    portfolios: Array<{
      portfolioId: string;
      portfolioName: string;
      files: {
        holdings: FileStatus;
        transactions: FileStatus;
        cashFlow: FileStatus;
        benchmark: FileStatus;
        performance: FileStatus;
        risk: FileStatus;
        compliance: FileStatus;
      };
    }>;
  }

  interface FileStatus {
    status: 'Pending' | 'Processing' | 'Success' | 'Warning' | 'Failed';
    fileName?: string;
    uploadedBy?: string;
    uploadedAt?: string;
    errorCount?: number;
  }
  ```
- **Components Needed:**
  - `PortfolioFileGrid` (data table component)
  - `FileStatusCell` (reusable cell component with icon, metadata, and buttons)
  - `StatusIcon` (icon component based on status)
  - `Badge` (shadcn/ui for status indicators)
- **Layout:**
  - Sticky header row for file type labels
  - Sticky left column for portfolio names
  - Horizontal scroll for grids with many portfolios

## Dependencies
- Epic 1, Story 1.3: Navigate to Batch Details (navigation from batch to this dashboard)

## Definition of Done
- [ ] Grid displays all portfolios and 7 file types
- [ ] Status icons render with correct colors
- [ ] File metadata displays correctly
- [ ] Action buttons appear based on file status
- [ ] Loading and error states render properly
- [ ] Tests pass for all acceptance criteria
