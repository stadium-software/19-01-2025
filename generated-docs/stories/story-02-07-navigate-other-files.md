# Story 2.7: Navigate to Other Files

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 7 of 7
**Wireframe:** [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md) → [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to proceed to the Other Files dashboard after completing portfolio file imports
**So that** I can continue with the monthly workflow by importing Bloomberg and custodian files

## Acceptance Tests

### Happy Path
- [ ] Given I am viewing the Portfolio Files dashboard, when I click the "Proceed to Other Files" button, then I am navigated to the Other Files Import Dashboard
- [ ] Given I navigate to Other Files, when the page loads, then I see the URL `/batches/{batchId}/other-files`
- [ ] Given I am on the Other Files dashboard, when I use the browser back button, then I return to the Portfolio Files dashboard
- [ ] Given I navigate to Other Files, when the page loads, then I see the batch context (Batch ID, Month, Year) in the page header

### Validation Before Proceeding
- [ ] Given all portfolio files have status "Pending", when I click "Proceed to Other Files", then I see a warning: "No portfolio files have been uploaded. Are you sure you want to proceed?"
- [ ] Given some portfolio files have status "Failed", when I click "Proceed to Other Files", then I see a warning: "Some portfolio files have errors. Proceeding may cause issues in later steps. Continue anyway?"
- [ ] Given all portfolio files have status "Success", when I click "Proceed to Other Files", then I navigate immediately without warnings
- [ ] Given some portfolio files have status "Warning", when I click "Proceed to Other Files", then I navigate immediately (warnings are not blockers)

### Warning Dialog Interactions
- [ ] Given the warning dialog is shown, when I click "Yes, proceed anyway", then I navigate to the Other Files dashboard
- [ ] Given the warning dialog is shown, when I click "No, stay here", then the dialog closes and I remain on the Portfolio Files dashboard
- [ ] Given the warning dialog is shown, when I press Escape, then the dialog closes and I remain on the Portfolio Files dashboard

### Processing Files Warning
- [ ] Given one or more files have status "Processing", when I click "Proceed to Other Files", then I see a warning: "Files are still processing. Proceeding will leave this page. Processing will continue in background."
- [ ] Given I see the processing warning, when I click "Proceed", then I navigate to Other Files and auto-refresh on this page stops
- [ ] Given files are processing and I navigate away, when I return to Portfolio Files dashboard later, then I see the updated statuses

### Button State
- [ ] Given I am viewing the Portfolio Files dashboard, when I hover over "Proceed to Other Files", then I see a tooltip: "Continue to Bloomberg and Custodian file imports"
- [ ] Given the dashboard is loading data, when I view the button, then the button is disabled until data loads
- [ ] Given I have paused auto-refresh, when I view the button, then the button remains enabled (pause state does not block navigation)

### Breadcrumb Navigation
- [ ] Given I navigate to Other Files, when I view the page, then I see breadcrumbs: "Start Page > Batch Details > Portfolio Files > Other Files"
- [ ] Given I am on Other Files, when I click "Portfolio Files" in the breadcrumbs, then I return to the Portfolio Files dashboard

### Edge Cases
- [ ] Given the batch has been finalized (L3 approved), when I view the Portfolio Files dashboard, then the "Proceed to Other Files" button is replaced with "View Other Files" (read-only mode)
- [ ] Given I navigate to Other Files for a non-existent batch, when the page loads, then I see a 404 error: "Batch not found"
- [ ] Given another user deletes the batch while I'm viewing it, when I click "Proceed to Other Files", then I see "Batch no longer exists" error and am redirected to Start Page

### Error Handling
- [ ] Given the API is unavailable, when I click "Proceed to Other Files", then I see "Unable to navigate. Please try again later." error toast
- [ ] Given my session expires, when I click "Proceed to Other Files", then I am redirected to the login page

### Keyboard Navigation
- [ ] Given the button is visible, when I press Tab to focus the button and press Enter, then I navigate to Other Files
- [ ] Given I press Ctrl+Click (or Cmd+Click on Mac) on the button, when the click registers, then Other Files opens in a new tab

### Progress Tracking
- [ ] Given I navigate to Other Files, when I view the Monthly Process Workflow screen later, then I see "Portfolio Files" marked as complete and "Other Files" as the active step

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/portfolio-files/summary` (to check readiness)
- **Navigation:** Next.js `useRouter()` or `<Link>` component
- **Route:** `/batches/[batchId]/other-files`
- **Validation Logic:**
  - Check if any files have status "Processing" → show processing warning
  - Check if all files have status "Pending" → show no-upload warning
  - Check if any files have status "Failed" → show error warning
  - Allow navigation in all cases (soft validation, not blocking)
- **Components Needed:**
  - `Button` (shadcn/ui for "Proceed to Other Files")
  - `AlertDialog` (shadcn/ui for warnings)
  - `Breadcrumbs` (custom or shadcn/ui component)
- **State Preservation:**
  - Save portfolio files completion state to backend
  - Mark "Portfolio Files" phase as complete in workflow tracking

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (source of "Proceed" button)
- Epic 3: Other Files Import Dashboard (destination screen)

## Definition of Done
- [ ] "Proceed to Other Files" button navigates to correct URL
- [ ] Validation warnings appear for pending/failed/processing files
- [ ] Users can proceed despite warnings (soft validation)
- [ ] Breadcrumb navigation works correctly
- [ ] Back button returns to Portfolio Files dashboard
- [ ] Workflow tracking marks Portfolio Files as complete
- [ ] Tests pass for all acceptance criteria
