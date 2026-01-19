# Story: View Critical Path

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 5 of 10

## User Story

**As an** operations lead
**I want** to see the critical path through the workflow
**So that** I can focus on steps that impact the overall timeline

## Acceptance Tests

### Happy Path
- [ ] Given I view the workflow, when I click "Show Critical Path", then critical path steps are highlighted in a distinct color
- [ ] Given I view critical path, when I see highlighted steps, then I see estimated completion date at the end
- [ ] Given I hover over a critical step, when I hover, then I see "Delay in this step will impact final deadline"

### Edge Cases
- [ ] Given all steps are on critical path, when I view, then all steps are highlighted

### Error Handling
- [ ] Given critical path calculation fails, when I click, then I see "Unable to calculate critical path"

## Implementation Notes
- Critical path algorithm: longest dependency chain
- Show estimated completion date based on current progress
- Highlight in orange or bold border
