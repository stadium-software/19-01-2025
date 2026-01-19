# Story: View Full Custom Holdings Audit

**Epic:** Epic 6: Custom Holding Capture
**Story:** 6 of 7

## User Story

**As a** compliance officer
**I want** to view full audit log across all custom holdings
**So that** I can review all manual position changes in one place

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Full Audit page, when the page loads, then I see all custom holding changes
- [ ] Given I filter by portfolio, when I apply filter, then I see changes for that portfolio only
- [ ] Given I filter by date range, when I apply, then I see changes within that range

### Edge Cases
- [ ] Given no changes exist, when I load, then I see "No audit records found"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load audit records"

## Implementation Notes
- API: GET /v1/custom-holdings/audit-trail/full
- Support pagination for large result sets
- Include export to Excel
