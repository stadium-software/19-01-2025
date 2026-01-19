# Story: Filter Logs by Status

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 13 of 14

## User Story

**As an** operations lead
**I want** to filter logs by status (Success/Failed/Warning)
**So that** I can focus on issues requiring attention

## Acceptance Tests

### Happy Path
- [ ] Given I am on any logs page, when I select "Failed" from status dropdown, then I see only failed processes
- [ ] Given I select "Success", when I apply filter, then I see only successful processes
- [ ] Given I select "All", when I apply, then I see all statuses

### Edge Cases
- [ ] Given no logs match the selected status, when I filter, then I see "No logs found with status '{status}'"

### Error Handling
- [ ] Given filter fails to apply, when I select a status, then I see "Failed to apply filter"

## Implementation Notes
- Status options: All, Success, Failed, Warning, In Progress
- Filter persists in localStorage
- Support multi-select (e.g., Failed + Warning)
