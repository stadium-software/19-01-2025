# Story: Mark Workflow Step Complete

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 3 of 10

## User Story

**As an** operations lead
**I want** to mark a workflow step as complete
**So that** dependent steps can be unblocked

## Acceptance Tests

### Happy Path
- [ ] Given I am viewing a step in progress, when I click "Mark Complete", then I see confirmation "Are you sure this step is complete?"
- [ ] Given I confirm, when I submit, then I see "Step marked complete" and status updates to green
- [ ] Given I mark a step complete, when I view the workflow, then dependent steps become available

### Edge Cases
- [ ] Given a step has incomplete tasks, when I try to mark complete, then I see "All tasks must be completed first"

### Error Handling
- [ ] Given the API fails, when I submit, then I see "Failed to update step status"

## Implementation Notes
- API: POST /v1/monthly-workflow/steps/{stepId}/complete
- Validate all prerequisites are complete
- Auto-notify owners of newly unblocked steps
