# Story: View Calculation Logs

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 11 of 14

## User Story

**As a** portfolio analyst
**I want** to view calculation process logs
**So that** I can verify calculation steps completed successfully

## Acceptance Tests

### Happy Path
- [ ] Given I navigate to Calculation Logs, when the page loads, then I see: Calculation Name, Start Time, End Time, Status, Records Processed
- [ ] Given I click a calculation, when I select it, then I see detailed step-by-step log
- [ ] Given calculations ran successfully, when I view logs, then I see green status indicators

### Edge Cases
- [ ] Given no calculations have run, when I load the page, then I see "No calculation logs found"

### Error Handling
- [ ] Given the API fails, when I load, then I see "Failed to load calculation logs"

## Implementation Notes
- API: GET /v1/calculation-logs
- Include filter by calculation type
- Show duration and records processed per step
