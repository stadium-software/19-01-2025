# Story: Auto-Refresh Confirmation Status

**Epic:** Epic 7: Data Confirmation & Verification
**Story:** 7 of 8

## User Story

**As an** operations lead
**I want** data confirmation status to auto-refresh
**So that** I can see real-time updates as issues are resolved

## Acceptance Tests

### Happy Path
- [ ] Given I am on Data Confirmation page, when 30 seconds elapse, then counts refresh automatically
- [ ] Given I am actively working, when auto-refresh occurs, then I see a brief "Updating..." indicator
- [ ] Given counts change, when refresh occurs, then changed counts are highlighted briefly

### Edge Cases
- [ ] Given I am editing a filter, when auto-refresh occurs, then my filter selections are preserved

### Error Handling
- [ ] Given auto-refresh fails, when the error occurs, then I see a toast notification "Failed to refresh. Click to retry."

## Implementation Notes
- Polling interval: 30 seconds
- Use optimistic UI updates (show changes immediately)
- Include manual "Refresh Now" button
- Pause auto-refresh when user is interacting with form inputs
