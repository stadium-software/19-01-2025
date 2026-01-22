# Story: View Weekly Process Logs

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 5 of 14

## User Story

**As an** operations lead
**I want** to view weekly process execution logs
**So that** I can monitor batch job performance

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Weekly Process Logs, when the page loads, then I see: Report Batch Date dropdown, two grids (Process Logs, User Audit Trail)
- [x] Given I select a batch date, when I apply, then I see logs for that week
- [x] Given I view process logs, when I see a row, then I see: Process Name, Start Time, End Time, Duration, Status, Error Count

### Edge Cases
- [x] Given no logs exist for selected date, when I view, then I see "No logs found for this date"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load weekly logs"

## Implementation Notes
- API: GET /v1/weekly-process-logs?batchDate={date}
- Support export to Excel for both grids
- Color code status: Green (success), Red (failed), Yellow (warnings)
