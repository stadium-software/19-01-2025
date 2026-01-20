# Story 1.3: Navigate to Batch Details

**Epic:** Epic 1 - Start Page & Report Batch Management
**Story:** 3 of 5
**Wireframe:** [Screen 1: Start Page (Batches List)](../wireframes/screen-01-start-page.md) → [Screen 4: Monthly Process Workflow View](../wireframes/screen-04-monthly-process-workflow.md)

## User Story

**As a** report administrator
**I want** to navigate to batch details from the batch list
**So that** I can view and manage the workflow for a specific monthly batch

## Acceptance Tests

### Happy Path
- [x] Given I am viewing the batch list, when I click the "View Details" button for a batch, then I am navigated to the Monthly Process Workflow View
- [x] Given I navigate to batch details, when the page loads, then I see the workflow view for the selected batch (Batch ID, Month, Year displayed in header)
- [x] Given I am on the workflow view, when I use the browser back button, then I return to the Start Page with the batch list intact
- [x] Given I navigate to batch details, when the URL loads, then I see `/batches/{batchId}/workflow` in the address bar

### Navigation Confirmation
- [x] Given a batch has Status = "In Progress", when I click "View Details", then I navigate to the workflow view without confirmation
- [x] Given a batch has Status = "Pending", when I click "View Details", then I navigate to the workflow view without confirmation
- [x] Given a batch has Status = "Completed", when I click "View Details", then I navigate to the workflow view in read-only mode
- [x] Given a batch has Status = "Failed", when I click "View Details", then I navigate to the workflow view showing error information

### Button States
- [x] Given I am viewing the batch list, when I hover over the "View Details" button, then I see a tooltip: "View workflow details for this batch"
- [x] Given I click "View Details", when the navigation is in progress, then I see a loading spinner (brief transition)
- [x] Given a batch is being deleted, when I view the batch list, then the "View Details" button is disabled for that batch

### Edge Cases
- [x] Given I navigate to a non-existent batch ID, when the page loads, then I see a 404 error: "Batch not found"
- [x] Given I navigate to an archived batch, when the workflow view loads, then I see a banner: "This batch has been archived and is read-only"
- [x] Given I have the workflow view open, when another user deletes the batch, then I see "This batch no longer exists" error and am redirected to Start Page

### Error Handling
- [x] Given the API is unavailable, when I click "View Details", then I see "Unable to load batch details. Please try again later." error toast
- [x] Given the batch data is corrupted, when the workflow view loads, then I see "Unable to display workflow. Contact support." error message
- [x] Given my session expires, when I click "View Details", then I am redirected to the login page

### Keyboard Navigation
- [x] Given I am viewing the batch list, when I press Tab to focus the "View Details" button and press Enter, then I navigate to the workflow view
- [x] Given the batch list is visible, when I press Ctrl+Click (or Cmd+Click on Mac) on "View Details", then the workflow opens in a new tab

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}`
- **Navigation:** Next.js `useRouter()` or `<Link>` component
- **Route:** `/batches/[batchId]/workflow`
- **Components Needed:**
  - `Link` or `Button` with `onClick` handler for navigation
  - `useRouter` from `next/navigation`
- **State Preservation:**
  - Use URL query params to preserve search/pagination state: `/batches?page=2&search=January`
  - When returning via back button, restore previous search/filter state
- **Security:**
  - Verify user has permission to view batch details
  - Handle unauthorized access with 403 error

## Dependencies
- Story 1.1: View Report Batches List (source of navigation)
- Epic 10: Monthly Process Workflow Orchestration (destination screen)

## Definition of Done
- [x] "View Details" button navigates to correct workflow URL
- [x] Workflow view loads with correct batch data
- [x] Back button returns to Start Page
- [x] Error handling works for invalid batch IDs
- [x] Loading state displays during navigation
- [x] Tests pass for all acceptance criteria
