# Story: Delete Custom Holding

**Epic:** Epic 6: Custom Holding Capture
**Story:** 4 of 7

## User Story

**As a** portfolio manager
**I want** to delete a custom holding
**So that** I can remove positions that are no longer valid

## Acceptance Tests

### Happy Path
- [ ] Given I select a holding, when I click Delete, then I see confirmation dialog "Are you sure you want to delete this holding?"
- [ ] Given I confirm deletion, when I click Yes, then I see "Holding deleted successfully"
- [ ] Given I delete a holding, when deletion completes, then audit trail records the deletion

### Edge Cases
- [ ] Given I click Cancel in confirmation, when I cancel, then the holding is not deleted

### Error Handling
- [ ] Given the API fails, when I delete, then I see "Failed to delete. Please try again."

## Implementation Notes
- API: DELETE /v1/custom-holdings/{id}
- Soft delete (mark as inactive) or hard delete based on business rules
- Deletion should be irreversible (no undo)
