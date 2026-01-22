# Story: View Monthly Process Logs

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 8 of 14

## User Story

**As an** operations lead
**I want** to view monthly process execution logs
**So that** I can monitor month-end batch processing

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Monthly Process Logs, when the page loads, then I see: Report Date filter, Process Logs grid, Approval Logs grid
- [x] Given I filter by date, when I apply, then I see logs for that month
- [x] Given I view process logs, when I see a row, then I see: Process Name, Start Time, End Time, Duration, Status, Error Count

### Edge Cases
- [x] Given no logs exist for selected month, when I view, then I see "No logs found"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load monthly logs"

## Implementation Notes
- API: GET /v1/monthly-process-logs?reportDate={date}
- Support export to Excel
- Include drill-down to error details
