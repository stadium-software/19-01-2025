# Story 2.6: Auto-refresh File Status

**Epic:** Epic 2 - Portfolio File Import Dashboard
**Story:** 6 of 7
**Wireframe:** [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md)

## User Story

**As a** report administrator
**I want** the file status grid to auto-refresh every 30 seconds when files are processing
**So that** I can see real-time progress without manually refreshing the page

## Acceptance Tests

### Happy Path
- [ ] Given one or more files have status "Processing", when I view the dashboard, then the grid auto-refreshes every 30 seconds
- [ ] Given the grid auto-refreshes, when new data loads, then I see updated status, progress percentage, and upload timestamps without page reload
- [ ] Given a file changes from "Processing" to "Success", when the next refresh occurs, then I see the status update with a green checkmark icon
- [ ] Given a file changes from "Processing" to "Failed", when the next refresh occurs, then I see the status update with a red X icon and "View Errors" button

### Refresh Indicator
- [ ] Given the grid is auto-refreshing, when data is being fetched, then I see a subtle spinner icon in the top-right corner with text "Updating..."
- [ ] Given the refresh completes, when new data loads, then I see a brief "Updated" checkmark icon that fades after 2 seconds
- [ ] Given the refresh is in progress, when I view the indicator, then the timestamp shows "Last updated: 15 seconds ago"

### Pause/Resume Auto-refresh
- [ ] Given auto-refresh is active, when I click the "Pause auto-refresh" button, then auto-refresh stops and the button changes to "Resume auto-refresh"
- [ ] Given auto-refresh is paused, when I click "Resume auto-refresh", then auto-refresh restarts with the next refresh in 30 seconds
- [ ] Given I pause auto-refresh, when I manually click "Refresh Now", then the grid refreshes immediately and auto-refresh remains paused

### Smart Refresh (Only When Needed)
- [ ] Given all files have status "Success", "Failed", or "Pending" (none processing), when 30 seconds elapse, then auto-refresh stops automatically
- [ ] Given auto-refresh has stopped, when a new file starts processing, then auto-refresh resumes automatically
- [ ] Given I navigate away from the dashboard, when I view another page, then auto-refresh stops to save resources

### Progress Updates During Processing
- [ ] Given a file is at 25% processing, when the grid refreshes, then I see "Processing... 25%" in the file cell
- [ ] Given a file is at 75% processing, when the grid refreshes, then I see an updated progress bar showing 75% complete
- [ ] Given a file completes processing between refreshes, when the next refresh occurs, then I see the final status immediately

### Edge Cases
- [ ] Given I have paused auto-refresh for 5+ minutes, when I resume, then the first refresh happens immediately (not in 30 seconds)
- [ ] Given my browser tab is inactive (background), when auto-refresh is active, then the refresh interval increases to 60 seconds to save battery
- [ ] Given I return to the active tab, when I focus the browser window, then auto-refresh resumes at 30-second intervals

### Manual Refresh
- [ ] Given auto-refresh is active, when I click "Refresh Now", then the grid refreshes immediately and the 30-second timer resets
- [ ] Given I manually refresh, when the refresh completes, then I see "Updated just now" timestamp
- [ ] Given I manually refresh while auto-refresh is paused, when the refresh completes, then auto-refresh remains paused

### Error Handling
- [ ] Given the API is unavailable during auto-refresh, when the refresh fails, then I see a toast: "Auto-refresh failed. Retrying in 30 seconds..."
- [ ] Given the API fails 3 times in a row, when the third failure occurs, then auto-refresh stops and I see "Auto-refresh disabled due to errors. Click 'Refresh Now' to retry."
- [ ] Given auto-refresh is disabled due to errors, when I click "Refresh Now" and it succeeds, then auto-refresh resumes automatically

### Network Optimization
- [ ] Given auto-refresh is active, when the request is made, then the API response only includes changed file statuses (not full grid data) to reduce bandwidth
- [ ] Given no files have changed, when auto-refresh occurs, then the UI shows "No changes" briefly and does not re-render the grid
- [ ] Given the API response is large, when auto-refresh completes, then only updated cells flash briefly to indicate changes

### User Preference Persistence
- [ ] Given I pause auto-refresh, when I refresh the browser page, then auto-refresh remains paused (setting persists in session storage)
- [ ] Given I have custom refresh interval preference (future feature), when I set it to 60 seconds, then auto-refresh uses 60-second intervals

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/portfolio-files?includeOnlyProcessing=true`
- **Polling Strategy:**
  - Use `setInterval()` with 30-second delay
  - Clear interval when all files are in final state (Success/Failed/Pending)
  - Use visibility API to detect inactive tabs and adjust interval
- **Components Needed:**
  - `AutoRefreshIndicator` (component showing last updated time and spinner)
  - `Button` (shadcn/ui for Pause/Resume/Refresh Now)
  - State management for refresh interval and pause state
- **Optimization:**
  - Only fetch statuses for files with "Processing" status
  - Use ETag or Last-Modified headers to avoid re-fetching unchanged data
  - Implement exponential backoff on consecutive failures
- **Session Storage:**
  - Store pause state: `sessionStorage.setItem('autoRefreshPaused', 'true')`
  - Restore on page load: `const paused = sessionStorage.getItem('autoRefreshPaused') === 'true'`

## Dependencies
- Story 2.1: Display Portfolio File Status Grid (grid to be refreshed)
- Story 2.2: Upload Portfolio File (creates "Processing" status files)

## Definition of Done
- [ ] Grid auto-refreshes every 30 seconds when files are processing
- [ ] Refresh indicator shows update status and timestamp
- [ ] Pause/Resume buttons control auto-refresh
- [ ] Auto-refresh stops automatically when no files are processing
- [ ] Manual refresh works and resets timer
- [ ] Error handling prevents infinite failed refresh loops
- [ ] Tests pass for all acceptance criteria
