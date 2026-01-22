# Story: Export File Faults

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 4 of 14

## User Story

**As an** operations lead
**I want** to export file faults to Excel
**So that** I can share error details with data providers

## Acceptance Tests

### Happy Path
- [x] Given I am on File Faults page, when I click "Export to Excel", then I download an Excel file
- [x] Given I open the export, when I review it, then I see columns: File Name, Row Number, Column, Error Message, Timestamp
- [x] Given I filter faults before export, when I export, then only filtered faults are included

### Error Handling
- [x] Given export fails, when I click Export, then I see "Export failed"

## Implementation Notes
- API: GET /v1/file-faults/export
- File name: FileFaults_YYYY-MM-DD.xlsx
- Include summary sheet with fault counts by error type
