# Story: View Blocked Steps

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 4 of 10

## User Story

**As an** operations lead
**I want** to see which steps are blocked and why
**So that** I can prioritize work to unblock them

## Acceptance Tests

### Happy Path
- [ ] Given workflow has blocked steps, when I view the page, then blocked steps are highlighted in red
- [ ] Given I hover over a blocked step, when I hover, then I see a tooltip "Blocked by: {step names}"
- [ ] Given I click a blocked step, when I select it, then I see the list of blocking dependencies

### Edge Cases
- [ ] Given no steps are blocked, when I view workflow, then all available steps are green or yellow

### Error Handling
- [ ] Given dependency calculation fails, when I load, then I see "Unable to determine dependencies"

## Implementation Notes
- Blocked status calculated based on prerequisite completion
- Show blocking step names in tooltip
- Include "Unblock Path" suggestion (which steps to complete first)
