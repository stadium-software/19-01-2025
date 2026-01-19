# Story: View Approval History

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 10 of 16

## User Story

**As a** user
**I want** to view full approval history for a batch
**So that** I can see the approval timeline

## Acceptance Tests

### Happy Path
- [ ] Given I am on any approval page, when I click "View History", then I see chronological list of approval actions
- [ ] Given I view history, when I see a record, then I see: Level, Action (Approved/Rejected), User, Timestamp, Reason (if rejected)
- [ ] Given multiple rejections occurred, when I view history, then I see all attempts

### Edge Cases
- [ ] Given no approvals yet, when I view history, then I see "No approval actions recorded"

### Error Handling
- [ ] Given the API fails, when I load history, then I see "Failed to load history"

## Implementation Notes
- API: GET /v1/approvals/{batchId}/history
- Sort by timestamp ascending (oldest first)
- Color code: Green (approved), Red (rejected)
