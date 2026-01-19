# Story: View Workflow Step Details

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 2 of 10

## User Story

**As an** operations lead
**I want** to view detailed information for a workflow step
**So that** I can understand step requirements and progress

## Acceptance Tests

### Happy Path
- [ ] Given I click a workflow step, when I select it, then I see a detail panel with: Description, Prerequisites, Tasks, Progress %, Owner, Due Date
- [ ] Given I view step details, when I see tasks, then I see checkboxes indicating completion status
- [ ] Given I view details, when I click a task, then I navigate to the relevant page

### Edge Cases
- [ ] Given a step has no tasks, when I view details, then I see "No tasks defined for this step"

### Error Handling
- [ ] Given the API fails, when I load details, then I see "Failed to load step details"

## Implementation Notes
- API: GET /v1/monthly-workflow/steps/{stepId}
- Detail panel should be modal or side panel
- Include links to related pages (e.g., Data Confirmation, Approvals)
