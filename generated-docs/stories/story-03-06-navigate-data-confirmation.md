# Story 3.6: Navigate to Data Confirmation

**Epic:** Epic 3 - Other Files Import Dashboard
**Story:** 6 of 6
**Wireframe:** [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md) → [Screen 11: Data Confirmation & Verification](../wireframes/screen-11-data-confirmation.md)

## User Story

**As a** report administrator
**I want** to proceed to Data Confirmation after uploading Other Files
**So that** I can verify all imported data before moving to maintenance phase

## Acceptance Tests

### Happy Path
- [x] Given I am viewing the Other Files dashboard, when I click "Proceed to Data Confirmation", then I navigate to the Data Confirmation screen
- [x] Given I navigate successfully, when the page loads, then I see the URL `/batches/{batchId}/data-confirmation`
- [x] Given I am on Data Confirmation, when I use the browser back button, then I return to the Other Files dashboard

### Validation Warnings
- [x] Given Bloomberg files have status "Pending", when I click Proceed, then I see a warning: "Bloomberg files not uploaded. Data quality may be affected. Continue?"
- [x] Given Custodian files have status "Failed", when I click Proceed, then I see a warning: "Custodian reconciliation failed. Review errors before proceeding."
- [x] Given only Additional files are pending, when I click Proceed, then I navigate immediately (no warning, they're optional)

### Processing Files Warning
- [x] Given any file has status "Processing", when I click Proceed, then I see "Files are still processing. Proceeding will leave this page. Processing will continue in background."

### Button State
- [x] Given the dashboard is loading, when I view the button, then "Proceed to Data Confirmation" is disabled until data loads
- [x] Given I hover over the button, when I view the tooltip, then I see "Continue to data verification phase"

## Implementation Notes
- **Navigation:** Next.js router to `/batches/[batchId]/data-confirmation`
- **Validation:** Soft warnings for missing Bloomberg/Custodian files, but allow proceed
- **Workflow State:** Mark "Other Files" phase as complete

## Dependencies
- Stories 3.1-3.5: Other Files upload and validation (source data)
- Epic 7: Data Confirmation & Verification (destination screen)

## Definition of Done
- [x] Proceed button navigates to Data Confirmation screen
- [x] Validation warnings display for pending/failed files
- [x] Users can proceed despite warnings (soft validation)
- [x] Workflow tracking marks Other Files as complete
- [x] Tests pass for all acceptance criteria
