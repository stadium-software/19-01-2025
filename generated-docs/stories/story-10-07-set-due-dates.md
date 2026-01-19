# Story: Set Step Due Dates

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 7 of 10

## User Story

**As an** operations lead
**I want** to set due dates for workflow steps
**So that** the team can track deadlines

## Acceptance Tests

### Happy Path
- [ ] Given I view a step, when I click "Set Due Date", then I see a date picker
- [ ] Given I select a date, when I save, then I see "Due date set successfully"
- [ ] Given a step is past due, when I view the workflow, then that step is highlighted in red with "OVERDUE" badge

### Edge Cases
- [ ] Given I set a due date before prerequisite due dates, when I save, then I see warning "Due date is before prerequisites"

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to set due date"

## Implementation Notes
- API: POST /v1/monthly-workflow/steps/{stepId}/due-date
- Validate due date logic (can't be before dependencies)
- Send reminder notifications 1 day before due date
