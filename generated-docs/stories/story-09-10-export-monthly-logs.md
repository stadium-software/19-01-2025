# Story: Export Monthly Process Logs

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 10 of 14

## User Story

**As an** operations lead
**I want** to export monthly process logs
**So that** I can archive or share them

## Acceptance Tests

### Happy Path
- [ ] Given I am on Monthly Process Logs page, when I click "Export to Excel", then I download an Excel file
- [ ] Given I open the export, when I review it, then I see sheets: Process Logs, Approval Logs
- [ ] Given I filter before export, when I export, then only filtered data is included

### Error Handling
- [ ] Given export fails, when I click Export, then I see "Export failed"

## Implementation Notes
- API: GET /v1/monthly-process-logs/export?reportDate={date}
- File name: MonthlyLogs_{reportDate}.xlsx
- Include summary statistics
