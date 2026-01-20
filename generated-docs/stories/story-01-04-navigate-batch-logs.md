# Story 1.4: Navigate to Batch Logs

**Epic:** Epic 1 - Start Page & Report Batch Management
**Story:** 4 of 5
**Wireframe:** [Screen 1: Start Page (Batches List)](../wireframes/screen-01-start-page.md) → [Screen 16: Monthly Process Logs](../wireframes/screen-16-monthly-process-logs.md)

## User Story

**As a** report administrator
**I want** to navigate to batch logs from the batch list
**So that** I can review detailed execution history and troubleshoot issues

## Acceptance Tests

### Happy Path
- [x] Given I am viewing the batch list, when I click the "View Logs" button for a batch, then I am navigated to the Monthly Process Logs screen
- [x] Given I navigate to batch logs, when the page loads, then I see the logs view for the selected batch (Batch ID, Month, Year displayed in header)
- [x] Given I am on the logs view, when I use the browser back button, then I return to the Start Page with the batch list intact
- [x] Given I navigate to batch logs, when the URL loads, then I see `/batches/{batchId}/logs` in the address bar

### Tab Default Behavior
- [x] Given I navigate to batch logs, when the page loads, then I see the "Workflow Logs" tab active by default
- [x] Given a batch has Status = "Failed", when I navigate to logs, then I see the "Job Execution Logs" tab active by default (showing errors first)
- [x] Given I am viewing logs, when I switch to the "Approval Logs" tab, then I see approval history details

### Button States
- [x] Given I am viewing the batch list, when I hover over the "View Logs" button, then I see a tooltip: "View execution logs for this batch"
- [x] Given a batch has Status = "Pending", when I view the batch list, then the "View Logs" button is visible but logs may be empty
- [x] Given a batch is being deleted, when I view the batch list, then the "View Logs" button is disabled for that batch

### Edge Cases
- [x] Given I navigate to a non-existent batch ID, when the logs page loads, then I see a 404 error: "Batch not found"
- [x] Given a batch has no logs yet, when the logs page loads, then I see "No logs available for this batch yet" message
- [x] Given I have the logs view open, when another user deletes the batch, then I see "This batch no longer exists" error and am redirected to Start Page

### Error Handling
- [x] Given the API is unavailable, when I click "View Logs", then I see "Unable to load batch logs. Please try again later." error toast
- [x] Given the logs data is too large, when the logs view loads, then I see paginated results with "Load More" button
- [x] Given my session expires, when I click "View Logs", then I am redirected to the login page

### Keyboard Navigation
- [x] Given I am viewing the batch list, when I press Tab to focus the "View Logs" button and press Enter, then I navigate to the logs view
- [x] Given the batch list is visible, when I press Ctrl+Click (or Cmd+Click on Mac) on "View Logs", then the logs open in a new tab

### Direct URL Access
- [x] Given I bookmark a logs URL, when I navigate directly to `/batches/{batchId}/logs`, then I see the logs view without visiting Start Page first
- [x] Given I share a logs URL with a colleague, when they navigate to it, then they see the same logs (if they have permissions)

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/logs`
- **Navigation:** Next.js `useRouter()` or `<Link>` component
- **Route:** `/batches/[batchId]/logs`
- **Components Needed:**
  - `Link` or `Button` with `onClick` handler for navigation
  - `useRouter` from `next/navigation`
- **State Preservation:**
  - Use URL query params to preserve search/pagination state on Start Page
  - When returning via back button, restore previous state
- **Security:**
  - Verify user has permission to view batch logs
  - Handle unauthorized access with 403 error
- **Performance:**
  - Lazy load large log files
  - Implement virtual scrolling for long logs

## Dependencies
- Story 1.1: View Report Batches List (source of navigation)
- Epic 9: Monthly Process Monitoring & Logs (destination screen)

## Definition of Done
- [x] "View Logs" button navigates to correct logs URL
- [x] Logs view loads with correct batch data
- [x] Back button returns to Start Page
- [x] Error handling works for invalid batch IDs
- [x] Loading state displays during navigation
- [x] Tests pass for all acceptance criteria
