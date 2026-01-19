# Story: Assign Step Owner

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 6 of 10

## User Story

**As an** operations lead
**I want** to assign owners to workflow steps
**So that** responsibilities are clear

## Acceptance Tests

### Happy Path
- [ ] Given I view a workflow step, when I click "Assign Owner", then I see a user dropdown
- [ ] Given I select a user, when I save, then I see "Owner assigned successfully"
- [ ] Given I assign an owner, when assignment completes, then the owner receives a notification

### Edge Cases
- [ ] Given a step already has an owner, when I reassign, then the previous owner is notified of the change

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to assign owner"

## Implementation Notes
- API: POST /v1/monthly-workflow/steps/{stepId}/assign
- User dropdown from active users with appropriate role
- Send email notification to assigned owner
