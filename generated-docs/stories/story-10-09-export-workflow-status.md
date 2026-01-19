# Story: Export Workflow Status

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 9 of 10

## User Story

**As an** operations lead
**I want** to export workflow status to Excel
**So that** I can share progress reports with management

## Acceptance Tests

### Happy Path
- [ ] Given I am on the workflow page, when I click "Export Status", then I download an Excel file
- [ ] Given I open the export, when I review it, then I see columns: Step Name, Status, Owner, Due Date, % Complete, Dependencies
- [ ] Given I export, when I view the file, then I see a summary sheet with overall progress

### Error Handling
- [ ] Given export fails, when I click Export, then I see "Export failed"

## Implementation Notes
- API: GET /v1/monthly-workflow/{batchId}/export
- File name: MonthlyWorkflow_{batchDate}.xlsx
- Include Gantt chart visualization in a separate sheet
