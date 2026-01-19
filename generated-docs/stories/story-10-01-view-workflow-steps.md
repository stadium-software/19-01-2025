# Story: View Monthly Workflow Steps

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 1 of 10

## User Story

**As an** operations lead
**I want** to view all month-end workflow steps
**So that** I can track progress through the monthly process

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Monthly Process Workflow, when the page loads, then I see a step-by-step visualization with: Step Name, Status, Dependencies, Owner
- [ ] Given I view workflow, when I see a step, then I see color-coded status: Green (complete), Yellow (in progress), Gray (not started), Red (blocked)
- [ ] Given I view workflow, when I see dependencies, then I see which steps must complete before others can start

### Edge Cases
- [ ] Given no workflow has been initiated, when I load the page, then I see "No active workflow - create a new report batch to begin"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load workflow"

## Implementation Notes
- API: GET /v1/monthly-workflow/{batchId}
- Visual representation: stepper or Gantt-style timeline
- Steps include: Data Load, Validation, Calculations, Approvals, Publishing
