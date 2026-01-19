# Story: Export Weekly Process Logs

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 7 of 14

## User Story

**As an** operations lead
**I want** to export weekly process logs
**So that** I can include them in operational reports

## Acceptance Tests

### Happy Path
- [ ] Given I am on Weekly Process Logs page, when I click "Export to Excel", then I download an Excel file with two sheets
- [ ] Given I open the export, when I review it, then I see: Sheet 1 (Process Logs), Sheet 2 (User Audit Trail)
- [ ] Given I export, when I view the file, then I see batch date in the header

### Error Handling
- [ ] Given export fails, when I click Export, then I see "Export failed"

## Implementation Notes
- API: GET /v1/weekly-process-logs/export?batchDate={date}
- File name: WeeklyLogs_{batchDate}.xlsx
- Include summary with total process count, success count, failure count
