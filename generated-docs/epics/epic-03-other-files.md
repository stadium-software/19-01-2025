# Epic 3: Other Files Import Dashboard

## Description
Provide a dashboard for managing Bloomberg, Custodian, and Additional Data file imports. These files complement portfolio files with market data, reconciliation data, and supplementary information needed for comprehensive reporting.

## Wireframe Reference
- [Screen 3: Other Files Import Dashboard](../wireframes/screen-03-other-files-dashboard.md)
- [Screen 2.1: File Import Popup](../wireframes/screen-02-1-file-import-popup.md) (reused)

## Business Value
- Centralized management of market data and reconciliation files
- Support for Bloomberg pricing and custodian reconciliation
- Flexible upload of additional data sources
- Complete data foundation before maintenance phase

## Stories

1. **Display Bloomberg Files Section** - Show Bloomberg file types with upload status
   - File: `story-03-01-display-bloomberg-section.md`
   - Status: Pending

2. **Display Custodian Files Section** - Show custodian file types with upload status
   - File: `story-03-02-display-custodian-section.md`
   - Status: Pending

3. **Display Additional Data Files Section** - Show optional supplementary files
   - File: `story-03-03-display-additional-section.md`
   - Status: Pending

4. **Upload/Re-import Other Files** - Reuse File Import Popup for Bloomberg/Custodian files
   - File: `story-03-04-upload-other-files.md`
   - Status: Pending

5. **View File Validation Errors** - Display errors for failed/warning status files
   - File: `story-03-05-view-other-file-errors.md`
   - Status: Pending

6. **Navigate to Data Confirmation** - Proceed button advances to Data Confirmation screen
   - File: `story-03-06-navigate-data-confirmation.md`
   - Status: Pending

## Dependencies
- Epic 2: Portfolio File Import Dashboard (must complete portfolio files first)

## Acceptance Criteria (Epic-Level)
- [ ] Users can view Bloomberg, Custodian, and Additional Data files in separate sections
- [ ] Users can upload and re-import other files with validation
- [ ] Users can view detailed error messages for failed imports
- [ ] Users can proceed to Data Confirmation after completing uploads
