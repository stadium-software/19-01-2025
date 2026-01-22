# Story: View File Faults

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 3 of 14

## User Story

**As an** operations lead
**I want** to view file processing errors
**So that** I can identify and resolve data quality issues

## Acceptance Tests

### Happy Path
- [x] Given I navigate to File Faults, when the page loads, then I see: File Name, Row Number, Column, Error Message, Timestamp
- [x] Given I filter by file name, when I apply filter, then I see faults for that file only
- [x] Given I click a fault row, when I select it, then I see detailed error context

### Edge Cases
- [x] Given no faults exist, when I load the page, then I see "No faults found - all files processed successfully"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load faults"

## Implementation Notes
- API: GET /v1/file-faults
- Group faults by file and error type
- Include export to Excel for fault remediation
