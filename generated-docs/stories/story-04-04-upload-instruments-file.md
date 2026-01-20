# Story: Upload Instruments File

**Epic:** Epic 4: Instrument Static Data Management
**Story:** 4 of 9

## User Story

**As a** data steward
**I want** to upload a bulk instrument file
**So that** I can efficiently add or update many instruments at once

## Acceptance Tests

### Happy Path
- [x] Given I click "Upload File", when I select a valid Excel/CSV file, then I see file name and size displayed
- [x] Given I upload a valid file, when processing completes, then I see "X instruments added, Y updated" summary
- [x] Given file upload succeeds, when I view the grid, then new/updated instruments appear

### Edge Cases
- [x] Given I upload a file with invalid ISINs, when validation runs, then I see a list of invalid rows with reasons
- [x] Given I upload a file with duplicate ISINs, when processing runs, then duplicates are updated (not added)

### Error Handling
- [ ] Given I upload a non-Excel file, when I click Upload, then I see "Invalid file format. Please upload .xlsx or .csv"
- [x] Given the API fails during upload, when processing starts, then I see "Upload failed. Please try again."

## Implementation Notes
- API: POST /v1/instruments/upload (multipart/form-data)
- File validation: max 5MB, .xlsx or .csv only
- Response should include success count, error count, and error details
- Show progress indicator during upload
