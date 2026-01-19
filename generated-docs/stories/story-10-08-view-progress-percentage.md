# Story: View Overall Workflow Progress

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 8 of 10

## User Story

**As an** operations lead
**I want** to see overall workflow completion percentage
**So that** I can report progress to stakeholders

## Acceptance Tests

### Happy Path
- [ ] Given I view the workflow page, when the page loads, then I see a progress bar at the top showing "X% Complete"
- [ ] Given I complete a step, when I refresh, then the progress percentage increases
- [ ] Given all steps are complete, when I view the workflow, then I see "100% Complete - Workflow Finished"

### Edge Cases
- [ ] Given no steps have started, when I view, then I see "0% Complete"

### Error Handling
- [ ] Given progress calculation fails, when I load, then I see "Unable to calculate progress"

## Implementation Notes
- Progress = (completed steps / total steps) * 100
- Include estimated completion date based on current velocity
- Show progress bar with color gradient (red → yellow → green)
