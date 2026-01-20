# Story 1.1: View Report Batches List

**Epic:** Epic 1 - Start Page & Report Batch Management
**Story:** 1 of 5
**Wireframe:** [Screen 1: Start Page (Batches List)](../wireframes/screen-01-start-page.md)

## User Story

**As a** report administrator
**I want** to view all monthly report batches in a searchable, paginated list
**So that** I can quickly find and access batches by month, year, or status

## Acceptance Tests

### Happy Path
- [x] Given I am on the Start Page, when the page loads, then I see a table with columns: Batch ID, Month, Year, Status, Created Date, Actions
- [x] Given there are 10+ batches, when the page loads, then I see pagination controls (10 rows per page)
- [x] Given I am viewing the batch list, when I click the "Next" pagination button, then I see the next 10 batches
- [x] Given I am on page 2, when I click "Previous", then I see the first 10 batches again
- [x] Given batches exist with different statuses, when I view the list, then I see color-coded status badges (In Progress: blue, Completed: green, Failed: red, Pending: gray)

### Search & Filter
- [x] Given I am viewing the batch list, when I type "2024" in the search box, then I see only batches with "2024" in any column
- [x] Given I search for "January", when the search completes, then I see only batches with Month = "January"
- [x] Given I search for a non-existent batch, when the search completes, then I see "No batches found" message
- [x] Given I have entered a search term, when I clear the search box, then I see all batches again

### Edge Cases
- [x] Given there are no batches in the system, when the page loads, then I see "No report batches found. Create your first batch to get started."
- [x] Given there are exactly 10 batches, when the page loads, then I do not see pagination controls
- [x] Given there are 25 batches, when I view the list, then I see "Page 1 of 3" indicator

### Error Handling
- [x] Given the API is unavailable, when the page loads, then I see "Unable to load batches. Please try again later."
- [x] Given the API returns an error, when the page loads, then I see a toast notification with the error message

### Loading States
- [x] Given I navigate to the Start Page, when data is loading, then I see a loading spinner with "Loading batches..." text
- [x] Given I am on the Start Page, when I click pagination, then I see a brief loading indicator during data fetch

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches?page={page}&pageSize={pageSize}&search={term}`
- **Components Needed:**
  - `ReportBatchesTable` (client component with search/pagination)
  - `StatusBadge` (reusable component for color-coded status)
  - `Pagination` (shadcn/ui component)
  - `Input` (shadcn/ui for search box)
- **State Management:**
  - Client-side search and pagination state
  - Debounced search (300ms delay)
- **Data Model:**
  ```typescript
  interface ReportBatch {
    id: string;
    month: string;
    year: number;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
    createdDate: string;
    createdBy: string;
  }
  ```

## Dependencies
None - This is the foundation story

## Definition of Done
- [x] Table displays all batch columns correctly
- [x] Search filters results in real-time
- [x] Pagination works for 10+ batches
- [x] Status badges display correct colors
- [x] Loading and error states render properly
- [x] Tests pass for all acceptance criteria
