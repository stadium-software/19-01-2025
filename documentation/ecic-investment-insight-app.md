# Feature: InvestInsight (ECIC) - Investment Operations Application

## Overview

InvestInsight is a comprehensive investment operations web application that supports portfolio management, weekly and monthly processing workflows, multi-level approvals, audit traceability, and operational file imports. The application serves investment teams managing multiple portfolios with complex data validation, approval workflows, and reporting requirements.

## Core User Roles

- **Operations Lead** - Manages report batches, file imports, and coordinates workflows
- **Investment Analyst** - Updates instruments, prices, ratings, and adds report commentary
- **Data Maintenance User** - Manages reference data (portfolios, benchmarks, asset managers, etc.)
- **Level 1 Approver** - First-level approval of data completeness
- **Level 2 Approver** - Portfolio-level review and risk checks
- **Level 3 Approver** - Final sign-off with authority to reject completed reports
- **Administrator** - User management, role assignment, system configuration

## High-Level User Journeys

### Monthly Report Cycle (Primary Workflow)
1. Operations Lead creates new monthly report batch
2. Import portfolio files (Holdings, Transactions, Income, Cash, Performance, Fees, Instrument Static)
3. Import other files (Bloomberg data, Custodian files)
4. Resolve file import issues and validation errors
5. Complete instrument data (prices, durations, betas, credit ratings)
6. Run Data Confirmation checks (file counts, data completeness)
7. Analyst adds report comments
8. Level 1 Approver reviews and approves (or rejects with reason)
9. Level 2 Approver reviews and approves (or rejects with reason)
10. Level 3 Approver final sign-off (or rejects with reason)
11. Reports published and batch completed

### Weekly Cashflow Cycle (Secondary Workflow)
1. Analyst captures projected cashflows (ZAR and USD)
2. System generates actual cashflows (editable baseline)
3. Analyst enters proposed cashflows to match actuals by currency
4. Review rebalancing recommendations
5. Complete batch and initiate next week

### Data Maintenance (Ongoing)
1. Users manage reference data entities (25+ CRUD screens)
2. Full audit trails capture all changes with user/timestamp
3. History views show time-series changes
4. Validation ensures data integrity

## Epic Breakdown

This application will be built in the following epics:

### Epic 1: Core Infrastructure & Authentication
- Set up authentication with role-based access control
- Define user roles and permissions
- Create base layout and navigation structure
- Set up API client configuration

### Epic 2: Start Page & Report Batch Management
- Start page with two tabs (Report Batches, New Report Batch)
- View recent monthly report batches and statuses
- Create new monthly report batch
- Report batch status tracking

### Epic 3: Portfolio File Import Dashboard
- View portfolio file import status (7 file types per portfolio)
- Upload portfolio files (Holdings, Transactions, Income, Cash, Performance, Fees, Instrument Static)
- File import status tracking with clickable icons
- Import popup with step viewer, cancel, retry validation
- Re-import functionality for portfolios

### Epic 4: Other Files Import Dashboard
- View Bloomberg and Custodian file import status
- Upload Bloomberg and Custodian files
- Same popup functionality as portfolio imports
- Single file per row display

### Epic 5: Instrument Data Management
- Instrument Static CRUD with status and check columns
- Toggle summary vs all-columns view
- Export incomplete ISINs to Excel
- Upload instrument file with validation
- Instrument audit trail and full audit trail
- Instrument Beta CRUD with audit trails
- Instrument Duration & YTM CRUD with audit trails

### Epic 6: Market Data Management
- Index Prices CRUD with history and upload
- Credit Rating CRUD with retry decision flow
- Credit Rating Changes view (month-over-month comparison)
- Credit Rating Scale maintenance

### Epic 7: Custom Holdings & Portfolio Data
- Custom Holding CRUD with portfolio/instrument dropdowns
- Custom Holding audit trails

### Epic 8: Data Confirmation & Validation
- File Check tab (expected vs actual file counts)
- Main Data Check tab (Asset Managers, Custodian, Bloomberg Holdings)
- Other Data Check tab (incomplete record counts: Instruments, Index Prices, Duration/YTM, Credit Ratings, Beta)
- Visual indicators for completeness

### Epic 9: Multi-Level Approval System
- Approve Level 1 view with approve/reject actions
- Approve Level 2 view with approve/reject actions
- Approve Level 3 view with approve/reject actions
- Rejection reason capture (required on reject)
- Reject Final Reports (L3 can reject after full approval)
- All rejections return workflow to Prepare Data status

### Epic 10: Weekly Process - Cashflow Management
- Projected Cashflow capture (ZAR and USD)
- Complete Projected Cashflow button (appears after both currencies entered)
- Actual Cashflow view (auto-filled, editable, non-deletable)
- Proposed Cashflow capture (currency from portfolio)
- Complete Cashflow Capture button (enabled when Proposed = Actual per currency)
- Cashflow Rebalancing Recommendations with currency filter
- Adjust buttons to return to previous steps
- Complete Batch button to finalize week
- Historical Cashflow view with report batch date filter

### Epic 11: Process Logs & Monitoring
- Monthly Process Logs (workflow audit trail)
- Report Batch Approval Logs (who approved/rejected when)
- File Process Logs with download capability
- File Faults view
- Weekly Process Logs
- User Audit Trail for weekly process
- Searchable and exportable to Excel

### Epic 12: Report Comments
- Report Comments CRUD
- Associate comments with report date
- Optional category/tag support

### Epic 13: Data Maintenance - Reference Data (Part 1)
- Asset Managers CRUD with full audit trail
- Portfolios CRUD with full audit trail
- Benchmarks CRUD with history and full audit trail
- Countries CRUD
- Currencies CRUD
- Indexes CRUD with history and full audit trail

### Epic 14: Data Maintenance - Reference Data (Part 2)
- Asset Class Groups CRUD
- Asset Class Group Maps CRUD
- Asset Class Group Limits CRUD with full audit trail
- Portfolio Asset Class Limits CRUD with full audit trail
- Credit Rating Group Portfolio Limits CRUD with full audit trail

### Epic 15: Data Maintenance - Fee & Transform Data
- Management Fee Rate CRUD with audit trails
- Custody Fee Rate CRUD with audit trails
- Transforms CRUD with full audit trail
- Asset Manager Transforms CRUD with full audit trail

### Epic 16: Data Maintenance - Additional Reference Data
- Tranche Portfolio Setup CRUD with full audit trail
- Portfolio Exclusions CRUD
- File Settings CRUD
- Finance Account Code CRUD
- Budget Performance CRUD
- Report List CRUD
- Credit Rating Scales CRUD

### Epic 17: Monthly Process Workflow Visualization
- Monthly Process Workflow view
- Visual step tracker showing current phase
- Dependency visualization
- Progress indicators

### Epic 18: SFTP Import & Automation
- SFTP Import page for automated file ingestion
- Manual trigger for SFTP imports
- Status tracking for SFTP jobs

### Epic 19: Full Audit Trail Screens (Compliance)
- Full audit trails for all entities requiring compliance tracking
- User/timestamp on all changes
- Version comparison views
- Export audit data to Excel

### Epic 20: Advanced Features & Polish
- Calculation Logs view
- Calculation Log Errors view
- Advanced grid features (sorting, filtering, pagination)
- Responsive design optimization
- Performance optimization for large datasets

## Technical Requirements

### Must Have
- [ ] Next.js 16 with App Router (React 19, TypeScript 5)
- [ ] Shadcn UI components throughout
- [ ] API client pattern from template (no direct fetch calls)
- [ ] Role-based access control using template's RBAC system
- [ ] Vitest + React Testing Library integration tests
- [ ] Toast notifications for user feedback
- [ ] Loading, error, and empty states for all data-driven pages
- [ ] Responsive design (mobile-friendly)

### Nice to Have
- [ ] Real-time status updates for file imports
- [ ] Advanced Excel export with formatting
- [ ] Bulk operations for data maintenance
- [ ] Dashboard KPIs and charts
- [ ] Email notifications for approvals
- [ ] Advanced search and filtering across all grids

## UI/UX Notes

### Design Patterns
- Use **Shadcn UI components** consistently (Button, Input, Dialog, Card, Form, Table, Tabs)
- Implement **data grids** with sorting, filtering, search, and Excel export
- Use **modal dialogs** for add/edit forms to maintain context
- Use **tabs** for multi-view pages (Start Page, Data Confirmation)
- Implement **status indicators** with color coding (green/yellow/red for file statuses)
- Use **toast notifications** for success/error feedback
- Implement **confirmation dialogs** for destructive actions (delete, reject)
- Use **loading skeletons** during data fetching
- Show **empty states** with helpful messaging when no data exists

### Navigation Structure
```
├── Home (Start Page)
├── Monthly Process
│   ├── Portfolio File Dashboard
│   ├── Other Files Dashboard
│   ├── Instruments
│   ├── Credit Ratings
│   ├── Index Prices
│   ├── Duration & YTM
│   ├── Beta
│   ├── Custom Holdings
│   ├── Data Confirmation
│   ├── Approve Level 1
│   ├── Approve Level 2
│   ├── Approve Level 3
│   ├── Reject Final Reports
│   ├── Process Logs
│   └── Monthly Workflow
├── Weekly Process
│   ├── Projected Cashflows
│   ├── Actual Cashflows
│   ├── Proposed Cashflows
│   ├── Rebalancing Recommendations
│   ├── Historical Cashflows
│   └── Weekly Process Logs
├── Data Maintenance
│   ├── Asset Managers
│   ├── Portfolios
│   ├── Benchmarks
│   ├── Instruments (duplicate link)
│   ├── Asset Class Groups
│   ├── Countries
│   ├── Currencies
│   ├── Fee Rates
│   ├── Transforms
│   └── (20+ more CRUD screens)
├── Reports
│   ├── Report Comments
│   └── Credit Rating Changes
├── Transformations
│   ├── Transforms
│   └── Asset Manager Transforms
└── Full Audit Trails
    └── (15+ audit screens)
```

### Key Workflows Visual States
1. **File Import Status Icons**: Use color-coded icons (green=success, yellow=processing, red=error)
2. **Approval Progress**: Visual stepper showing L1 → L2 → L3 with current state highlighted
3. **Data Confirmation Checks**: Traffic light indicators (red/amber/green) for each check category
4. **Cashflow Capture**: Step indicator showing Projected → Actual → Proposed → Complete
5. **Monthly Workflow**: Kanban-style board or step tracker for month-end process

## Technical Notes

### API Structure (To Be Created)
The API specification will be created in `/api/Api-Definition.yaml` with the following endpoint groups:
- `/api/report-batches` - Report batch management
- `/api/portfolios` - Portfolio CRUD
- `/api/instruments` - Instrument data
- `/api/file-imports` - File import status and operations
- `/api/approvals` - Approval workflow
- `/api/cashflows` - Weekly cashflow data
- `/api/maintenance/*` - All reference data entities
- `/api/audit/*` - Audit trail endpoints
- `/api/logs/*` - Process log endpoints

### State Management
- Use React Server Components for data fetching where possible
- Client components only for interactivity (forms, modals, real-time updates)
- API client handles loading/error states consistently
- Toast context for global notifications

### Data Validation
- Use Zod schemas from template for form validation
- Server-side validation on all API endpoints
- Client-side validation for immediate feedback
- File upload validation (type, size limits)

### Testing Strategy
- Integration tests for complete user workflows (MVP focus)
- Test approval workflow end-to-end
- Test file import workflows
- Test data confirmation checks
- Test CRUD operations for key entities
- Test RBAC permissions
- Mock API responses for unavailable backend endpoints

## Success Criteria

The application is successful when:
1. ✅ Operations Lead can create a new report batch and track its status
2. ✅ Analysts can import all required files and resolve validation issues
3. ✅ Data Confirmation checks guide users to complete missing data
4. ✅ Multi-level approval workflow functions correctly with reject loops
5. ✅ Weekly cashflow capture works with currency validation
6. ✅ All 25+ reference data entities have working CRUD operations
7. ✅ Audit trails capture all changes with full traceability
8. ✅ Process logs provide visibility into system operations
9. ✅ Role-based access control prevents unauthorized actions
10. ✅ Application is responsive and performs well with real-world data volumes

## Implementation Phases

### Phase 1: Foundation (Epics 1-2)
Infrastructure, authentication, start page, report batch management

### Phase 2: Core Workflows (Epics 3-9)
File imports, instrument management, data confirmation, approvals

### Phase 3: Weekly Process (Epic 10-11)
Cashflow management and process logs

### Phase 4: Reference Data (Epics 12-16)
All data maintenance CRUD screens

### Phase 5: Advanced Features (Epics 17-20)
Workflow visualization, SFTP, audit trails, polish

## Next Steps

Run `/start` to begin the TDD workflow. The feature-planner agent will:
1. Transform this spec into detailed epics with stories
2. Create acceptance tests for each story
3. Guide implementation with test-first development
4. Run quality gates before PR submission
