# Feature: InvestInsight - Investment Operations Platform

## Summary

InvestInsight is a comprehensive investment operations web application that supports reference data maintenance, weekly and monthly processing workflows, multi-level approvals, audit traceability, and operational imports for portfolio reporting and oversight.

## Epics

### Epic 1: Start Page & Report Batch Management
**Status:** Pending
**Stories:** 5
**Description:** Landing page providing entry into processes and maintenance areas, with ability to create and manage report batches.

Stories:
1. View Report Batches (story-01-01)
2. Create New Report Batch (story-01-02)
3. Navigate to Batch Details (story-01-03)
4. Navigate to Batch Logs (story-01-04)
5. Export Batch List (story-01-05)

---

### Epic 2: Portfolio File Import Dashboard
**Status:** Pending
**Stories:** 7
**Description:** Dashboard for managing portfolio-specific file imports (Instrument Static, Holdings, Transactions, Income, Cash, Performance, Fees) with status tracking and error handling.

Stories:
1. Display Portfolio File Grid (story-02-01)
2. Upload Portfolio File (story-02-02)
3. Re-Import Portfolio File (story-02-03)
4. View Import Errors (story-02-04)
5. Cancel File Import (story-02-05)
6. Auto-Refresh Import Status (story-02-06)
7. Navigate to Other Files Dashboard (story-02-07)

---

### Epic 3: Other Files Import Dashboard
**Status:** Pending
**Stories:** 6
**Description:** Dashboard for managing Bloomberg, custodian, and additional data file imports with validation and retry capabilities.

Stories:
1. Display Bloomberg File Section (story-03-01)
2. Display Custodian File Section (story-03-02)
3. Display Additional Files Section (story-03-03)
4. Upload Other Files (story-03-04)
5. View Other File Errors (story-03-05)
6. Navigate to Data Confirmation (story-03-06)

---

### Epic 4: Instrument Static Data Management
**Status:** Pending
**Stories:** 9
**Description:** Comprehensive CRUD operations for instrument master data with audit trails, history tracking, file uploads, and data quality exports.

Stories:
1. View Instruments Grid (story-04-01)
2. Add New Instrument (story-04-02)
3. Update Existing Instrument (story-04-03)
4. Upload Instruments File (story-04-04)
5. View Instrument Audit Trail (story-04-05)
6. View Instrument History (story-04-06)
7. Export Incomplete ISINs (story-04-07)
8. View Instrument Popup Details (story-04-08)
9. Toggle Grid Columns (story-04-09)

---

### Epic 5: Market Data Maintenance
**Status:** Pending
**Stories:** 12
**Description:** Management of index prices, instrument durations (YTM), and betas with upload capabilities, history tracking, and audit trails for risk calculations.

Stories:
1. View Index Prices Grid (story-05-01)
2. Add Index Price (story-05-02)
3. Update Index Price (story-05-03)
4. Upload Index Prices File (story-05-04)
5. View Price History (story-05-05)
6. View Price Popup (story-05-06)
7. View Instrument Durations Grid (story-05-07)
8. Add Instrument Duration (story-05-08)
9. Update Instrument Duration (story-05-09)
10. View Instrument Betas Grid (story-05-10)
11. Add Instrument Beta (story-05-11)
12. Update Instrument Beta (story-05-12)

---

### Epic 6: Custom Holding Capture
**Status:** Pending
**Stories:** 7
**Description:** Manual entry and management of custom holdings (e.g., fixed deposits) with full CRUD operations, audit trails, and portfolio filtering.

Stories:
1. View Custom Holdings Grid (story-06-01)
2. Add Custom Holding (story-06-02)
3. Update Custom Holding (story-06-03)
4. Delete Custom Holding (story-06-04)
5. View Custom Holding Audit Trail (story-06-05)
6. View Full Custom Holdings Audit (story-06-06)
7. Filter Custom Holdings by Portfolio (story-06-07)

---

### Epic 7: Data Confirmation & Verification
**Status:** Pending
**Stories:** 8
**Description:** Guided verification hub with three tabs (File Check, Main Data Check, Other Data Check) to ensure all required data is loaded and complete before approval.

Stories:
1. View File Check Tab (story-07-01)
2. View Main Data Check Tab (story-07-02)
3. View Other Data Check Tab (story-07-03)
4. Navigate to Fix Data Gaps (story-07-04)
5. Overall Confirmation Status Indicator (story-07-05)
6. Export Data Confirmation Report (story-07-06)
7. Auto-Refresh Confirmation Status (story-07-07)
8. Disable Approval When Incomplete (story-07-08)

---

### Epic 8: Multi-Level Approval Workflow
**Status:** Pending
**Stories:** 16
**Description:** Three-stage approval process (L1, L2, L3) with approve/reject capabilities, reason capture, approval history, comments, and post-approval rejection for governance and audit.

Stories:
1. View Level 1 Approval Page (story-08-01)
2. Approve at Level 1 (story-08-02)
3. Reject at Level 1 (story-08-03)
4. View Level 2 Approval Page (story-08-04)
5. Approve at Level 2 (story-08-05)
6. Reject at Level 2 (story-08-06)
7. View Level 3 Approval Page (story-08-07)
8. Approve at Level 3 (Final) (story-08-08)
9. Reject at Level 3 (Final) (story-08-09)
10. View Approval History (story-08-10)
11. View Report Comments (story-08-11)
12. Add Approval Comment (story-08-12)
13. View Report Batch Approval Logs (story-08-13)
14. Export Approval Logs (story-08-14)
15. Reject After Final Approval (story-08-15)
16. Notifications on Approval Actions (story-08-16)

---

### Epic 9: Monthly Process Monitoring & Logs
**Status:** Pending
**Stories:** 14
**Description:** Comprehensive logging and monitoring for file processing, weekly/monthly batch jobs, calculation processes, user audit trails, and error tracking with search and export capabilities.

Stories:
1. View File Process Logs (story-09-01)
2. Download Processed File (story-09-02)
3. View File Faults (story-09-03)
4. Export File Faults (story-09-04)
5. View Weekly Process Logs (story-09-05)
6. View User Audit Trail (story-09-06)
7. Export Weekly Process Logs (story-09-07)
8. View Monthly Process Logs (story-09-08)
9. Search Process Logs (story-09-09)
10. Export Monthly Process Logs (story-09-10)
11. View Calculation Logs (story-09-11)
12. View Calculation Errors (story-09-12)
13. Filter Logs by Status (story-09-13)
14. View Detailed Log Entry (story-09-14)

---

### Epic 10: Monthly Process Workflow Orchestration
**Status:** Pending
**Stories:** 10
**Description:** Visual workflow tracker for month-end processes showing step dependencies, critical path, ownership, due dates, progress tracking, and collaboration via comments.

Stories:
1. View Monthly Workflow Steps (story-10-01)
2. View Workflow Step Details (story-10-02)
3. Mark Workflow Step Complete (story-10-03)
4. View Blocked Steps (story-10-04)
5. View Critical Path (story-10-05)
6. Assign Step Owner (story-10-06)
7. Set Step Due Dates (story-10-07)
8. View Overall Workflow Progress (story-10-08)
9. Export Workflow Status (story-10-09)
10. Add Workflow Comments (story-10-10)

---

## Summary Statistics

- **Total Epics:** 10
- **Total Stories:** 94
- **Status:** All epics pending - ready for test generation (SPECIFY phase)

## Next Steps

All story planning is complete. The next phase is **SPECIFY** - use the **test-generator** agent to convert acceptance tests into executable test code, one epic at a time.

Recommended epic implementation order:
1. Epic 1: Start Page & Report Batch Management (foundation)
2. Epic 2: Portfolio File Import Dashboard (data intake)
3. Epic 3: Other Files Import Dashboard (data intake)
4. Epic 4: Instrument Static Data Management (reference data)
5. Epic 5: Market Data Maintenance (risk data)
6. Epic 6: Custom Holding Capture (manual data)
7. Epic 7: Data Confirmation & Verification (quality gates)
8. Epic 8: Multi-Level Approval Workflow (governance)
9. Epic 9: Monthly Process Monitoring & Logs (observability)
10. Epic 10: Monthly Process Workflow Orchestration (process management)
