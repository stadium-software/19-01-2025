# Story: Export Approval Logs

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 14 of 16

## User Story

**As a** compliance officer
**I want** to export approval logs to Excel
**So that** I can include them in audit reports

## Acceptance Tests

### Happy Path
- [ ] Given I am on approval logs page, when I click "Export to Excel", then I download an Excel file
- [ ] Given I open the file, when I review it, then I see columns: Batch Date, Level, Approver, Action, Timestamp, Reason
- [ ] Given I filter logs before export, when I export, then only filtered records are included

### Error Handling
- [ ] Given export fails, when I click Export, then I see "Export failed"

## Implementation Notes
- API: GET /v1/monthly-process-logs/approval-logs/export
- File format: .xlsx
- File name: ApprovalLogs_YYYY-MM-DD.xlsx
