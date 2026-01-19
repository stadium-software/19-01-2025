# Epic 2: Portfolio File Import Dashboard

## Description
Provide a comprehensive dashboard for managing portfolio file imports across multiple portfolios. Users can upload, re-import, view errors, and monitor the status of 7 different file types per portfolio. The dashboard auto-refreshes during processing and provides real-time feedback on import progress.

## Wireframe Reference
- [Screen 2: Portfolio Files Import Dashboard](../wireframes/screen-02-portfolio-files-dashboard.md)
- [Screen 2.1: File Import Popup](../wireframes/screen-02-1-file-import-popup.md)

## Business Value
- Centralized management of all portfolio data imports
- Real-time visibility into file processing status
- Error detection and correction workflow
- Foundation for accurate portfolio analysis

## Stories

1. **Display Portfolio File Status Grid** - Show 7 file types per portfolio with status icons and metadata
   - File: `story-02-01-display-file-grid.md`
   - Status: Pending

2. **Upload Portfolio File** - Click Upload button opens File Import Popup for file upload
   - File: `story-02-02-upload-file.md`
   - Status: Pending

3. **Re-import Portfolio File** - Click Re-import button opens File Import Popup in replace mode
   - File: `story-02-03-reimpor t-file.md`
   - Status: Pending

4. **View File Import Errors** - Click View Errors button displays validation error details
   - File: `story-02-04-view-errors.md`
   - Status: Pending

5. **Cancel In-Progress Import** - Cancel button stops ongoing import job
   - File: `story-02-05-cancel-import.md`
   - Status: Pending

6. **Auto-refresh File Status** - Poll backend every 30 seconds when files are processing
   - File: `story-02-06-auto-refresh.md`
   - Status: Pending

7. **Navigate to Other Files** - Proceed to Other Files button advances workflow
   - File: `story-02-07-navigate-other-files.md`
   - Status: Pending

## Dependencies
- Epic 1: Start Page & Report Batch Management (batch must exist to import files)

## Acceptance Criteria (Epic-Level)
- [ ] Users can view status of all portfolio files in a grid layout
- [ ] Users can upload and re-import files with validation
- [ ] Users can view detailed error messages for failed imports
- [ ] Dashboard auto-refreshes during file processing
- [ ] Users can proceed to Other Files dashboard after portfolio files are complete
