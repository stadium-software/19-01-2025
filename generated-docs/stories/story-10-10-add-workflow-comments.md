# Story: Add Workflow Comments

**Epic:** Epic 10: Monthly Process Workflow Orchestration
**Story:** 10 of 10

## User Story

**As a** team member
**I want** to add comments to workflow steps
**So that** I can communicate progress or issues

## Acceptance Tests

### Happy Path
- [ ] Given I view a step, when I click "Add Comment", then I see a text field
- [ ] Given I enter a comment, when I save, then I see "Comment added successfully"
- [ ] Given I add a comment, when I save, then the comment appears with my username and timestamp

### Edge Cases
- [ ] Given I leave comment empty, when I save, then I see "Comment cannot be empty"

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to add comment"

## Implementation Notes
- API: POST /v1/monthly-workflow/steps/{stepId}/comments
- Comments visible to all users
- Include @mention support to notify specific users
- Show comment count badge on step cards
