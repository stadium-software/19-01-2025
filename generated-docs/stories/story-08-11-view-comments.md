# Story: View Report Comments

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 11 of 16

## User Story

**As an** approver
**I want** to view comments added during preparation
**So that** I have context for my approval decision

## Acceptance Tests

### Happy Path
- [x] Given comments exist for the batch, when I view approval page, then I see a Comments section
- [x] Given I view comments, when I see the list, then I see: Author, Timestamp, Comment Text
- [x] Given no comments exist, when I view approval page, then I see "No comments added"

### Error Handling
- [x] Given the API fails, when I load comments, then I see "Failed to load comments"

## Implementation Notes
- API: GET /v1/report-comments?batchId={batchId}
- Display in read-only mode on approval pages
- Include "Add Comment" link for approvers
