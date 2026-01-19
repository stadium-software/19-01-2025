# Story: Add Approval Comment

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 12 of 16

## User Story

**As an** approver
**I want** to add comments during review
**So that** I can document questions or observations

## Acceptance Tests

### Happy Path
- [ ] Given I am on an approval page, when I click "Add Comment", then I see a text field
- [ ] Given I enter a comment, when I save, then I see "Comment added successfully"
- [ ] Given I add a comment, when I refresh, then my comment appears in the comments list

### Edge Cases
- [ ] Given I leave comment empty, when I save, then I see "Comment cannot be empty"

### Error Handling
- [ ] Given the API fails, when I save, then I see "Failed to add comment"

## Implementation Notes
- API: POST /v1/report-comments
- Comments visible to all approvers
- Capture username and timestamp automatically
