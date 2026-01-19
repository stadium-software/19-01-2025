# Story: View Detailed Log Entry

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 14 of 14

## User Story

**As an** operations lead
**I want** to view detailed information for a log entry
**So that** I can troubleshoot issues in depth

## Acceptance Tests

### Happy Path
- [ ] Given I click a log row, when I select it, then I see a detail panel with: Full Process Log, Parameters Used, Input/Output Counts, Error Details (if any)
- [ ] Given I view details, when I see the panel, then I can expand/collapse log sections
- [ ] Given I view details, when I click "Copy Log", then the log text is copied to clipboard

### Edge Cases
- [ ] Given a log has no errors, when I view details, then Error Details section is hidden

### Error Handling
- [ ] Given the API fails, when I load details, then I see "Failed to load log details"

## Implementation Notes
- API: GET /v1/process-logs/{id}/details
- Detail panel should be a modal or side panel
- Include "Download Full Log" button (exports as .txt)
