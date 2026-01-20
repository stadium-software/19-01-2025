# Story 3.2: Display Custodian Files Section

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 2 of 6
**Wireframe:** [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)

## User Story

**As a** report administrator
**I want** to view Custodian file types and their upload status
**So that** I can track which reconciliation files have been imported

## Acceptance Tests

### Happy Path
- [x] Given I navigate to the Other Files dashboard, when the page loads, then I see a section titled "Custodian Files"
- [x] Given I view the Custodian section, when I look at the file types, then I see rows for: Holdings Reconciliation, Transaction Reconciliation, Cash Reconciliation
- [x] Given I view a Custodian file row, when I look at the columns, then I see: File Type, File Name, Upload Date, Status, Actions
- [x] Given a Custodian file has been uploaded, when I view the row, then I see the file name, upload date, and status icon (same as Bloomberg section)

### Status and Actions
- [x] Given a Custodian file has any status, when I view the row, then I see the same status icons as Bloomberg files (green check, yellow warning, red X, gray clock, blue spinner)
- [x] Given a Custodian file has status "Pending", when I view the row, then I see an "Upload" button
- [x] Given a Custodian file has status "Success", when I view the row, then I see a "Re-import" button
- [x] Given a Custodian file has status "Failed", when I view the row, then I see "View Errors" and "Re-import" buttons

### Section Behavior
- [x] Given the Custodian section is visible, when I click the section header, then the section collapses
- [x] Given all Custodian files have status "Success", when I view the section header, then I see a green checkmark icon

### Edge Cases
- [x] Given no Custodian files have been uploaded, when I view the section, then all rows show status "Pending"

### Loading and Error States
- [x] Given I navigate to the dashboard, when Custodian data is loading, then I see skeleton loaders
- [x] Given the API fails, when I view the section, then I see "Unable to load Custodian files. Please try again later."

## Implementation Notes
- **API Endpoint:** `GET /v1/report-batches/{batchId}/other-files?category=custodian`
- **Components:** Reuse `FileSectionCard`, `FileRow`, and `StatusIcon` from Story 3.1

## Dependencies
- Story 3.1: Display Bloomberg Files Section (shares UI components)

## Definition of Done
- [x] Custodian section displays all file types
- [x] Status icons and action buttons work correctly
- [x] Section collapse/expand functions
- [x] Tests pass for all acceptance criteria
