# Story 3.3: Display Additional Data Files Section

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 3 of 6
**Wireframe:** [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view optional additional data file types
**So that** I can track supplementary data uploads

## Acceptance Tests

### Happy Path
- [x] Given I navigate to the Other Files dashboard, when the page loads, then I see a section titled "Additional Data Files (Optional)"
- [x] Given I view the Additional section, when I look at the file types, then I see rows for: FX Rates, Custom Benchmarks, Market Commentary
- [x] Given the section header says "Optional", when I proceed without uploading these files, then no validation errors occur

### Status and Actions
- [x] Given an Additional file has any status, when I view the row, then I see the same UI as Bloomberg/Custodian sections
- [x] Given all Additional files are "Pending", when I view the section header, then I see an info icon with tooltip: "These files are optional"

### Edge Cases
- [x] Given no Additional files are uploaded, when I proceed to Data Confirmation, then I see no warnings

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/other-files?category=additional`
- **Validation:** Additional files are truly optional - no blocking validations

## Dependencies
- Story 3.1: Display Bloomberg Files Section

## Definition of Done
- [x] Additional section displays with "Optional" label
- [x] Files can be uploaded or skipped
- [x] Tests pass for all acceptance criteria
