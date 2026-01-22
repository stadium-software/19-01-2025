# Story: View Calculation Errors

**Epic:** Epic 9: Monthly Process Monitoring & Logs
**Story:** 12 of 14

## User Story

**As a** portfolio analyst
**I want** to view calculation errors
**So that** I can identify and resolve calculation issues

## Acceptance Tests

### Happy Path
- [x] Given I navigate to Calculation Log Errors, when the page loads, then I see: Calculation Name, Error Type, Error Message, Affected Record, Timestamp
- [x] Given I filter by calculation name, when I apply filter, then I see errors for that calculation only
- [x] Given I click an error, when I select it, then I see full stack trace and context

### Edge Cases
- [x] Given no errors exist, when I load the page, then I see "No calculation errors found - all calculations successful"

### Error Handling
- [x] Given the API fails, when I load, then I see "Failed to load errors"

## Implementation Notes
- API: GET /v1/calculation-log-errors
- Group errors by type
- Include export to Excel
