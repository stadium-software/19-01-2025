# InvestInsight – Application Description (POC-Style)

# Overview

InvestInsight is an investment operations web application that supports reference data maintenance, weekly and monthly processing workflows, approvals, audit traceability, and operational imports. The SPA (Vue + Vite) delivers a large set of entity management screens (Add/Update/View/Audit/History), operational dashboards for imports and logs, and multi-level approvals for month-end processes.

# In Scope (Implemented)

# Menu Structure (SPA)

- Start Page
  - Home tabs: Report Batches, New Report Batch
- Data Maintenance
- Month End Process
- Week End Process
- SFTP Import
- New Report Batch
- Standard UI patterns per entity:

## Start Page

- StartPage (Route: /StartPage): Landing page providing entry into processes and maintenance areas.
  - Home tabs:
    - Report Batches: Shows the last few monthly report batches and their statuses.
    - New Report Batch: Button to initiate a new monthly report batch (also available on NewReportBatchPage).

## Home / New Report Batch

- NewReportBatchPage (Route: /NewReportBatchPage): Dedicated page to initiate a new monthly report batch.
  - Action: Create New Report Batch.
  - View: tabular grid with filters/sort/search (where applicable)

### Portfolio File Dashboard

- PortfolioImports (Route: /PortfolioImports): Dashboard of files per portfolio (Instrument Static, Holdings, Transactions, Income, Cash, Performance, Fees). Each file type is a clickable status icon sourced from API status.
  - Popup (PortfolioImportsPopup / PortfolioReImportPopup):
    - Shows the current step of the import process with back navigation.
    - Buttons: Cancel File (delete file and clear related tables), Retry Validation (enabled when status = FixData), Re-Import.
    - Upload Tab: Inline file upload to submit/replace files for processing.
- PortfolioImportsUpload (Route: /PortfolioImportsUpload): Upload handler for portfolio imports (reuses same popup patterns).

# End-to-End Walkthrough (High-Level)

### Other Files Dashboard

- OtherImports (Route: /OtherImports): Dashboard for Bloomberg and custodian files (one file per row). Clickable status icons with same popup behavior as Portfolio File Dashboard.
- OtherImportsUpload (Route: /OtherImportsUpload): Upload for other imports.
- OtherImportsPopup (Route: /OtherImportsPopup): Popup with step viewer, cancel, retry validation, and upload tab.

3. Month-end instrument and calculation data is prepared and verified; approvals progress through Level 1 → Level 2 → Level 3.

### Instruments

- InstrumentStatic (Route: /InstrumentStatic): Static instrument data page.
- InstrumentStaticPopup: Contextual popup for static instrument data.
- InstrumentStaticUploadFile (Route: /InstrumentStaticUploadFile): Upload for static instrument data.
- InstrumentUpdate (Route: /InstrumentUpdate): Update form for instrument data.
- InstrumentAuditTrail: Audit trail for instrument data.
- InstrumentFullAuditTrail: Full audit log for instrument data.
- InstrumentAdd (Route: /InstrumentAdd): Add form for instrument data.
  - Grid behavior: Toggle to collapse/expand Status and Check columns; toggle Summary vs All-columns view.
  - Actions: Export incomplete ISINs (Excel), Upload Instrument File (opens same popup as Portfolio imports).
- Week End Process

### Credit Ratings

- CrediRating (Route: /CreditRating): Main credit ratings view (CRUD).
- CrediRatingsUpdate: Update form for credit ratings.
- CrediRatingHistory: Historical values/snapshots.
- CrediRatingFullAuditTrail: Full audit log.
  - Action: Retry Decision Flow (re-run final rating decision for local/international ratings).

### Index Prices

- IndexPricesView (Route: /IndexPricesView): CRUD for index prices with per-record history.
- IndexPricesUpdate: Update form for index prices.
- IndexPricesUploadFile: Upload file for index prices.
- IndexPricesHistory: Historical index price values.
- IndexPricesPopup: Contextual popup for index prices.
- Upload File: File selection and submission to update or seed data.

### Instrument Beta

- InstrumentBetaView (Route: /InstrumentBetaView): CRUD for instrument beta.
- InstrumentBetaEdit: Edit form for instrument beta.
- InstrumentBetaAdd: Add form for instrument beta.
- InstrumentBetaAuditTrail: Audit trail for instrument beta.
- InstrumentBetaFullAuditTrail: Full audit log for instrument beta.

### Instrument Duration

- InstrumentDurationView (Route: /InstrumentDurationView): CRUD for instrument duration and Yield-to-Maturity (YTM).
- InstrumentDurationEdit: Edit form for instrument duration.
- InstrumentDurationAdd (Route: /InstrumentDurationAdd): Add form for instrument duration.
- InstrumentDurationAuditTrail: Audit trail for instrument duration.
- InstrumentDurationFullAuditTrail: Full audit log for instrument duration.

## Data Maintenance

### Custom Holding

- CustomHoldingAdd (Route: /CustomHoldingAdd): Add form for custom holdings (e.g., fixed deposits).
- CustomHoldingUpdate: Update form for custom holdings.
- CustomHoldingView: Grid/list for custom holdings.
- CustomHoldingAuditTrail: Audit trail for custom holdings.
- CustomHoldingFullAuditTrail: Full audit log for custom holdings.
  - Capture fields include dropdowns: PortfolioCode, InstrumentCode.
- AssetClassGroupLimitFullAuditTrail: Full audit log for a limit.

### Data Confirmation

- DataConfirmation: Overall data confirmation hub with three tabs:
  - File Check: Expected vs actual file counts per asset manager, Bloomberg, and custodian.
  - Main Data Check: Verifies core tables are populated from the two dashboards (Asset Managers, Custodian, Bloomberg Holdings).
  - Other Data Check: Incomplete record counts across Index Prices, Duration & YTM, Credit Ratings, Beta, Instruments.
- AssetClassGroupMapUpdate: Update form for Asset Class Group Map.

### Approvals

- ApproveLevel1 → ApproveLevel1View (Route: /ApproveLevel1View): First-level approval (available only after Data Confirmation). Can reject with reason capture.
- ApproveLevel2 → ApproveLevel2View (Route: /ApproveLevel2View): Second-level approval (available only after Data Confirmation). Can reject with reason capture.
- ApproveLevel3 → ApproveLevel3View (Route: /ApproveLevel3View): Final approval (available only after Data Confirmation). Can reject with reason capture.
- AssetClassGroupAdd: Add form for Asset Class Group.

### Reject Final Reports

- RejectFinalReportsView (Route: /RejectFinalReportsView): Level 3 approvers can reject after full approval; returns workflow to Prepare Data (all rejections route here).
- AssetClassGroupView: Grid/list for Asset Class Groups.

### Monthly Process Logs

- MonthlyProcessLogsView (Route: /MonthlyProcessLogsView): Monthly process logs (workflow audit) and Report Batch Approval Logs (who approved/rejected and when). Searchable and exportable to Excel; report date filter provided.

### Asset Managers

### File Process Logs

- FileProcessLogsView (Route: /FileProcessLogsView): All imported files with status and a download button; report date filter.
- FileFaultsView (Route: /FileFaultsView): Faults detected during file processing.
- AssetManagersView: Grid/list for Asset Managers.

### Actual Cash Flow Values

- ActualCashFlowValuesAdd: Add form for actual cash flow values (auto-filled baseline; editable; non-deletable).
- ActualCashFlowValuesUpdate: Update form for actual cash flow values.
- ActualCashFlowValuesView: Grid/list for actual cash flow values.
- BenchmarksAdd: Add form for Benchmark.

### Projected Cash Flow Values

- ProjectedCashFlowValuesAdd: Add form for projected cash flow values. Once ZAR and USD entries exist, "Capture" hides and "Complete Projected Cashflow" appears.
- ProjectedCashFlowValuesUpdate: Update form for projected cash flow values.
- ProjectedCashFlowValuesView: Grid/list for projected cash flow values.
- BenchmarksFullAuditTrail: Full audit log for a Benchmark.

### Proposed Cash Flow Values

- ProposedCashFlowValuesAdd: Add form for proposed cash flow values.
- ProposedCashFlowValuesUpdate: Update form for proposed cash flow values.
  - Button logic: Show "Complete Cashflow Capture" only when Proposed totals equal Actual totals per currency (currency derived from portfolio).
- BudgetPerformanceAdd: Add form for Budget Performance.

### Cash Flow Rebalancing Recommendations

- RebalancingRecommendations (Route: /RebalancingRecommendations): Read-only overview with step visual at top.
  - Currency dropdown (ZAR/USD) filters four grids: Projected, Actual, Proposed, Calculated Cashflows.
  - Buttons: Adjust Projected Cashflows, Adjust Actual Cashflows, Complete Batch (completes week and initiates next batch).
- BudgetPerformanceView: Grid/list for Budget Performance.

### Historical Cashflow Values

- HistoricalCashFlow (Route: /HistoricalCashFlow): Same layout as Rebalancing Recommendations without action buttons; adds Report Batch Date dropdown to view prior weeks.

### Countries

### Weekly Process Logs

- WeeklyProcessLogsView (Route: /WeeklyProcessLogsView): Select a report batch date to view two grids — Weekly Process Logs and User Audit Trail; both exportable to Excel.
- CountriesUpdate: Update form for Country.
- CountriesView: Grid/list for Countries.

### Credit Rating Group Portfolio Limits

- CreditRatingGroupPortfolioLimitAdd: Add form for Group Portfolio Limit.
- CreditRatingGroupPortfolioLimitUpdate: Update form for Group Portfolio Limit.
- CreditRatingGroupPortfolioLimitView: Grid/list for Group Portfolio Limits.
- CreditRatingGroupPortfolioLimitFullAuditTrail: Full audit log for a Group Portfolio Limit.

### Credit Rating Scales

- CreditRatingScaleAdd: Add form for Credit Rating Scale.
- CreditRatingScaleUpdate: Update form for Credit Rating Scale.
- CreditRatingScaleView: Grid/list for Credit Rating Scales.

### Currencies

- CurrenciesAdd: Add form for Currency.
- CurrenciesUpdate: Update form for Currency.
- CurrenciesView: Grid/list for Currencies.

### Custody Fee Rate

- CustodyFeeRateAdd: Add form for Custody Fee Rate.
- CustodyFeeRateUpdate: Update form for Custody Fee Rate.
- CustodyFeeRateView: Grid/list for Custody Fee Rates.
- CustodyFeeRateAuditTrail: Audit trail for a Custody Fee Rate.
- CustodyFeeRateFullAuditTrail: Full audit log for a Custody Fee Rate.

### File Settings

- FileSettingsAdd: Add form for File Settings.
- FileSettingsUpdate: Update form for File Settings.
- FileSettingsView: Grid/list for File Settings.

### Finance Account Code

- FinanceAccountCodeAdd: Add form for Finance Account Code.
- FinanceAccountCodeUpdate: Update form for Finance Account Code.
- FinanceAccountCodeView: Grid/list for Finance Account Codes.

### Indexes

- IndexesAdd: Add form for Index.
- IndexesUpdate: Update form for Index.
- IndexesView: Grid/list for Indexes.
- IndexesHistory: Historical values/snapshots for Index.
- IndexesFullAuditTrail: Full audit log for Index.

### Management Fee Rate

- ManagementFeeRateAdd: Add form for Management Fee Rate.
- ManagementFeeRateUpdate: Update form for Management Fee Rate.
- ManagementFeeRateView: Grid/list for Management Fee Rates.
- ManagementFeeRateAuditTrail: Audit trail for Management Fee Rate.
- ManagementFeeRateFullAuditTrail: Full audit log for Management Fee Rate.

### Portfolio Asset Class Limits

- PortfolioAssetClassLimitAdd: Add form for Portfolio Asset Class Limit.
- PortfolioAssetClassLimitUpdate: Update form for Portfolio Asset Class Limit.
- PortfolioAssetClassLimitView: Grid/list for Portfolio Asset Class Limits.
- PortfolioAssetClassLimitFullAuditTrail: Full audit log for Portfolio Asset Class Limit.

### Portfolio Exclusion

- PortfolioExclusionAdd: Add form for Portfolio Exclusion.
- PortfolioExclusionUpdate: Update form for Portfolio Exclusion.
- PortfolioExclusionView: Grid/list for Portfolio Exclusions.

### Portfolios

- PortfoliosAdd: Add form for Portfolio.
- PortfoliosUpdate: Update form for Portfolio.
- PortfoliosView: Grid/list for Portfolios.
- PortfoliosFullAuditTrail: Full audit log for Portfolio.

### Report List

- ReportListAdd: Add form for Report List entry.
- ReportListUpdate: Update form for Report List entry.
- ReportListView: Grid/list for Report List.

### Tranche Portfolio Setup

- TranchePortfolioSetupAdd: Add form for Tranche Portfolio Setup.
- TranchePortfolioSetupUpdate: Update form for Tranche Portfolio Setup.
- TranchePortfolioSetupView: Grid/list for Tranche Portfolio Setup.
- TranchePortfolioSetupFullAuditTrail: Full audit log for Tranche Portfolio Setup.

### Transforms

- TransformsAdd: Add form for Transform.
- TransformsUpdate: Update form for Transform.
- TransformsView: Grid/list for Transforms.
- TransformsFullAuditTrail: Full audit log for Transform.

### Transforms Asset Manager

- TransformAssetManagersAdd: Add form for Transform Asset Manager mapping.
- TransformAssetManagersUpdate: Update form for Transform Asset Manager mapping.
- TransformsAssetManagersView: Grid/list for Transform Asset Manager mappings.
- TransformsAssetManagerFullAuditTrail: Full audit log for Transform Asset Manager mapping.

## Month End Process

### Approvals

- ApproveLevel1 → ApproveLevel1View: Review/approve items at Level 1.
- ApproveLevel2 → ApproveLevel2View: Review/approve items at Level 2.
- ApproveLevel3 → ApproveLevel3View: Review/approve items at Level 3.

### Reject Final Reports

- RejectFinalReportsView: Reject final reports page.

### Calculation Logs

- CalculationLogs: Process/run log list.
- CalculationLogErrors: Error list filtered from calculation logs.

### Credit Ratings

- CrediRating: Main credit ratings view.
- CrediRatingsUpdate: Update form for credit ratings.
- CrediRatingHistory: Historical values/snapshots.
- CrediRatingFullAuditTrail: Full audit log.

### Credit Rating Changes

- CreditRatingChangesView: View of credit rating changes.

### Custom Holding

- CustomHoldingAdd: Add form for custom holdings.
- CustomHoldingUpdate: Update form for custom holdings.
- CustomHoldingView: Grid/list for custom holdings.
- CustomHoldingAuditTrail: Audit trail for custom holdings.
- CustomHoldingFullAuditTrail: Full audit log for custom holdings.

### Data Confirmation

- DataConfirmation: Overall data confirmation hub.
- MainDataCheck: Main dataset checks.
- OtherDataCheck: Other dataset checks.

### File Process Logs

- FileProcessLogsView: Process logs for files.
- FileFaultsView: Faults detected during file processing.

### Index Prices

- IndexPricesView: Grid/list for index prices.
- IndexPricesUpdate: Update form for index prices.
- IndexPricesUploadFile: Upload file for index prices.
- IndexPricesHistory: Historical index price values.
- IndexPricesPopup: Contextual popup for index prices.

### Instrument Beta

- InstrumentBetaView: Grid/list for instrument beta.
- InstrumentBetaEdit: Edit form for instrument beta.
- InstrumentBetaAdd: Add form for instrument beta.
- InstrumentBetaAuditTrail: Audit trail for instrument beta.
- InstrumentBetaFullAuditTrail: Full audit log for instrument beta.

### Instrument Duration

- InstrumentDurationView: Grid/list for instrument duration.
- InstrumentDurationEdit: Edit form for instrument duration.
- InstrumentDurationAdd: Add form for instrument duration.
- InstrumentDurationAuditTrail: Audit trail for instrument duration.
- InstrumentDurationFullAuditTrail: Full audit log for instrument duration.

### Instruments

- InstrumentStatic: Static instrument data page.
- InstrumentStaticPopup: Contextual popup for static instrument data.
- InstrumentStaticUploadFile: Upload for static instrument data.
- InstrumentUpdate: Update form for instrument data.
- InstrumentAuditTrail: Audit trail for instrument data.
- InstrumentFullAuditTrail: Full audit log for instrument data.
- InstrumentAdd: Add form for instrument data.

### Monthly Process Logs

- MonthlyProcessLogsView: Monthly process log listing and details.

### Monthly Workflow

- MonthlyProcessWorkflowView: Workflow visualization/step tracker for monthly process.

### Other Files Dashboard

- OtherImports: Dashboard/list for other file imports.
- OtherImportsUpload: Upload handler for other imports.
- OtherImportsPopup: Contextual popup for other imports.

### Portfolio File Dashboard

- PortfolioImports: Dashboard/list for portfolio imports.
- PortfolioImportsUpload: Upload handler for portfolio imports.
- PortfolioImportsPopup: Contextual popup for portfolio imports.
- PortfolioReImportPopup: Contextual popup for re-importing a portfolio file.

### Report Comments

- ReportCommentsAdd: Add comment form for reports.
- ReportCommentsUpdate: Update comment form for reports.
- ReportCommentsView: Grid/list for report comments.

## Week End Process

### Actual Cash Flow Values

- ActualCashFlowValuesAdd: Add form for actual cash flow values.
- ActualCashFlowValuesUpdate: Update form for actual cash flow values.
- ActualCashFlowValuesView: Grid/list for actual cash flow values.

### Cash Flow Rebalancing Recommendations

- RebalancingRecommendations: Generated recommendations for cash flow rebalancing.

### Historical Cashflow Values

- HistoricalCashFlow: Historical cash flow values screen.

### Projected Cash Flow Values

- ProjectedCashFlowValuesAdd: Add form for projected cash flow values.
- ProjectedCashFlowValuesUpdate: Update form for projected cash flow values.
- ProjectedCashFlowValuesView: Grid/list for projected cash flow values.

### Proposed Cash Flow Values

- ProposedCashFlowValuesAdd: Add form for proposed cash flow values.
- ProposedCashFlowValuesUpdate: Update form for proposed cash flow values.

### Weekly Process Logs

- WeeklyProcessLogsView: Weekly process log listing and details.

## Other Pages

- SftpImportPage: SFTP import page for operational file ingestion.
- NewReportBatchPage: Create and manage new report batches.

# UI Behaviors & Validations (General)

- Required fields validated on Add/Update.
- View grids support basic inspection and navigation to Edit; some modules include popups for quick-view/context actions.
- Audit/AuditTrail/FullAuditTrail screens show user/time-stamped changes; History screens show time-series snapshots.
- Upload screens provide file selection and submission; success/failure reported via toasts/modals (per standard SPA patterns).

# Supported APIs and Backend Components (Observed)

- Controllers and base classes:
  - AValidatedControllerBase (validation-enabled base for controllers)
  - FileHandlerController (file upload/download and handling)
- Web API filters (Areas/WebApi): API key and authentication attributes used to protect endpoints where applicable.
- Services modules (indicative):
  - Authentication, Authorization, Spa, Files, Administration, Session, FolderPath, Connectors, Error handling, DebugLogger

Note: Exact endpoint routes and DTOs aren’t listed here; screens above integrate with the corresponding entities’ CRUD/lookup endpoints and file handlers as appropriate.

# SPA Routes Map (Implemented)

This map lists the active SPA paths and their view components for quick navigation.

- Start: / (redirects to /StartPage)
- Start Page: /StartPage → views/StartPage.vue
- New Report Batch: /NewReportBatchPage → views/NewReportBatchPage.vue
- SFTP Import: /SftpImportPage → views/SftpImportPage.vue

- Month End Process
  - Approvals L1: /ApproveLevel1View → views/ApproveLevel1View.vue
  - Approvals L2: /ApproveLevel2View → views/ApproveLevel2View.vue
  - Approvals L3: /ApproveLevel3View → views/ApproveLevel3View.vue
  - Reject Final Reports: /RejectFinalReportsView → views/RejectFinalReportsView.vue
  - Calculation Logs: /CalculationLogs → views/CalculationLogs.vue
  - Calculation Log Errors: /CalculationLogErrors → views/CalculationLogErrors.vue
  - Credit Rating: /CreditRating → views/CreditRating.vue
  - Credit Ratings Update: /CreditRatingsUpdate → views/CreditRatingsUpdate.vue
  - Credit Rating History: /CrediRatingHistory → views/CrediRatingHistory.vue
  - Credit Rating Full Audit Trail: /CrediRatingFullAuditTrail → views/CrediRatingFullAuditTrail.vue
  - Credit Rating Changes: /CreditRatingChangesView → views/CreditRatingChangesView.vue
  - Custom Holding: /CustomHoldingView, /CustomHoldingAdd, /CustomHoldingUpdate, /CustomHoldingAuditTrail, /CustomHoldingFullAuditTrail → views/CustomHolding\*.vue
  - Data Confirmation: /DataConfirmation, /MainDataCheck, /OtherDataCheck → views/_Data_.vue
  - File Process Logs: /FileProcessLogsView, /FileFaultsView → views/File\*View.vue
  - Index Prices: /IndexPricesView, /IndexPricesUpdate, /IndexPricesUploadFile, /IndexPricesHistory, /IndexPricesPopup → views/IndexPrices\*.vue
  - Instruments: /InstrumentStatic, /InstrumentAdd, /InstrumentUpdate, /InstrumentStaticUploadFile, /InstrumentStaticPopup, /InstrumentAuditTrail, /InstrumentFullAuditTrail → views/Instrument\*.vue
  - Instrument Beta: /InstrumentBetaView, /InstrumentBetaAdd, /InstrumentBetaEdit, /InstrumentBetaAuditTrail, /InstrumentBetaFullAuditTrail → views/InstrumentBeta\*.vue
  - Instrument Duration: /InstrumentDurationView, /InstrumentDurationAdd, /InstrumentDurationEdit, /InstrumentDurationAuditTrail, /InstrumentDurationFullAuditTrail → views/InstrumentDuration\*.vue
  - Monthly Process Logs: /MonthlyProcessLogsView → views/MonthlyProcessLogsView.vue
  - Monthly Workflow: /MonthlyProcessWorkflowView → views/MonthlyProcessWorkflowView.vue
  - Other Imports: /OtherImports, /OtherImportsUpload, /OtherImportsPopup → views/OtherImports\*.vue
  - Portfolio Imports: /PortfolioImports, /PortfolioImportsUpload, /PortfolioImportsPopup, /PortfolioReImportPopup → views/PortfolioImports\*.vue
  - Report Comments: /ReportCommentsView, /ReportCommentsAdd, /ReportCommentsUpdate → views/ReportComments\*.vue

- Week End Process
  - Actual Cash Flow Values: /ActualCashFlowValuesView, /ActualCashFlowValuesAdd, /ActualCashFlowValuesUpdate → views/ActualCashFlowValues\*.vue
  - Projected Cash Flow Values: /ProjectedCashFlowValuesView, /ProjectedCashFlowValuesAdd, /ProjectedCashFlowValuesUpdate → views/ProjectedCashFlowValues\*.vue
  - Proposed Cash Flow Values: /ProposedCashFlowValuesAdd, /ProposedCashFlowValuesUpdate → views/ProposedCashFlowValues\*.vue
  - Rebalancing Recommendations: /RebalancingRecommendations → views/RebalancingRecommendations.vue
  - Historical Cash Flow: /HistoricalCashFlow → views/HistoricalCashFlow.vue
  - Weekly Process Logs: /WeeklyProcessLogsView → views/WeeklyProcessLogsView.vue

- Data Maintenance
  - Asset Managers: /AssetManagersView, /AssetManagersAdd, /AssetManagersUpdate, /AssetManagersFullAuditTrail → views/AssetManagers\*.vue
  - Benchmarks: /BenchmarksView, /BenchmarksAdd, /BenchmarksUpdate, /BenchmarksHistory, /BenchmarksFullAuditTrail → views/Benchmarks\*.vue
  - Countries: /CountriesView, /CountriesAdd, /CountriesUpdate → views/Countries\*.vue
  - Currencies: /CurrenciesView, /CurrenciesAdd, /CurrenciesUpdate → views/Currencies\*.vue
  - Indexes: /IndexesView, /IndexesAdd, /IndexesUpdate, /IndexesHistory, /IndexesFullAuditTrail → views/Indexes\*.vue
  - Portfolios: /PortfoliosView, /PortfoliosAdd, /PortfoliosUpdate, /PortfoliosFullAuditTrail → views/Portfolios\*.vue
  - Credit Rating Scale: /CreditRatingScaleView, /CreditRatingScaleAdd, /CreditRatingScaleUpdate → views/CreditRatingScale\*.vue
  - Transforms: /TransformsView, /TransformsAdd, /TransformsUpdate, /TransformsFullAuditTrail → views/Transforms\*.vue
  - Transforms Asset Managers: /TransformsAssetManagersView, /TransformAssetManagersAdd, /TransformAssetManagersUpdate, /TransformsAssetManagerFullAuditTrail → views/TransformsAssetManager\*.vue
  - Tranche Portfolio Setup: /TranchePortfolioSetupView, /TranchePortfolioSetupAdd, /TranchePortfolioSetupUpdate, /TranchePortfolioSetupFullAuditTrail → views/TranchePortfolioSetup\*.vue
  - Management Fee Rate: /ManagementFeeRateView, /ManagementFeeRateAdd, /ManagementFeeRateUpdate, /ManagementFeeRateAuditTrail, /ManagementFeeRateFullAuditTrail → views/ManagementFeeRate\*.vue
  - Custody Fee Rate: /CustodyFeeRateView, /CustodyFeeRateAdd, /CustodyFeeRateUpdate, /CustodyFeeRateAuditTrail, /CustodyFeeRateFullAuditTrail → views/CustodyFeeRate\*.vue
  - Asset Class Group Limits: /AssetClassGroupLimitView, /AssetClassGroupLimitAdd, /AssetClassGroupLimitUpdate, /AssetClassGroupLimitFullAuditTrail → views/AssetClassGroupLimit\*.vue
  - Portfolio Asset Class Limits: /PortfolioAssetClassLimitView, /PortfolioAssetClassLimitAdd, /PortfolioAssetClassLimitUpdate, /PortfolioAssetClassLimitFullAuditTrail → views/PortfolioAssetClassLimit\*.vue
  - File Settings: /FileSettingsView, /FileSettingsAdd, /FileSettingsUpdate → views/FileSettings\*.vue
  - Credit Rating Group Portfolio Limit: /CreditRatingGroupPortfolioLimitView, /CreditRatingGroupPortfolioLimitAdd, /CreditRatingGroupPortfolioLimitUpdate, /CreditRatingGroupPortfolioLimitFullAuditTrail → views/CreditRatingGroupPortfolioLimit\*.vue
  - Finance Account Code: /FinanceAccountCodeView, /FinanceAccountCodeAdd, /FinanceAccountCodeUpdate → views/FinanceAccountCode\*.vue
  - Budget Performance: /BudgetPerformanceView, /BudgetPerformanceAdd, /BudgetPerformanceUpdate → views/BudgetPerformance\*.vue
  - Report List: /ReportListView, /ReportListAdd, /ReportListUpdate → views/ReportList\*.vue
  - Portfolio Exclusion: /PortfolioExclusionView, /PortfolioExclusionAdd, /PortfolioExclusionUpdate → views/PortfolioExclusion\*.vue
  - Asset Class Group: /AssetClassGroupView, /AssetClassGroupAdd, /AssetClassGroupUpdate → views/AssetClassGroup\*.vue
  - Asset Class Group Map: /AssetClassGroupMapView, /AssetClassGroupMapAdd, /AssetClassGroupMapUpdate → views/AssetClassGroupMap\*.vue

# API Endpoints Map (Implemented)

This section summarizes observable backend endpoints and their purpose. Most are secured with authentication, anti-forgery, and/or API key filters as noted.

- File Handling
  - GET api/FileHandler?content=… → stream file or content (Controllers/FileHandlerController.cs)
  - POST api/FileHandler/download → download content with filename-based content type

- Administration Area (secured; requires Administrator policy)
  - Users (api/Administration/Users/\*) → list/add/edit/delete, admin flag, role assignment
    - GET All, POST Add, PUT Edit, PUT EditIsAdministrator, DELETE Delete
  - Roles (api/Administration/Roles/\*) → list/add/edit/delete roles and page access
    - GET All, POST Add, PUT Edit, DELETE Delete
  - Pages (api/Administration/Pages/\*) → list pages and edit page-role mappings
    - GET All, PUT Edit

- Web API Area (API key validation; some also allow anonymous)
  - Users (api/users) [AllowAnonymous + AuthenticationTypeValidation + UserApiKeyValidation]
    - GET ?, GET count, GET {id}, GET find, POST (add), PUT {id} (edit), DELETE {id}
  - Roles (api/roles) [AllowAnonymous + AuthenticationTypeValidation + UserApiKeyValidation]
    - GET (list roles)
  - Settings (api/settings) [AllowAnonymous + WebApiKeyValidation]
    - GET (list settings), PUT (edit setting value)
  - Configuration (api/configuration) [AllowAnonymous + WebApiKeyValidation]
    - GET all (misc + custom headers + session timeout), PUT misc, POST/PUT/DELETE custom-header, POST smtp
  - WebApi Info (api/api-info) [AllowAnonymous + WebApiKeyValidation]
    - GET supported-features → advertised feature list (adds UserApi if auth != Anonymous)
  - Additional controllers present: ConnectionsController, DebugModeController, LoginModeController, UpdateHistoryController, UserApiKeyController (not fully enumerated here)

Auth/Validation Filters observed:

- [AuthenticationTypeValidation], [UserApiKeyValidation], [WebApiKeyValidation]
- [Authorize(Policies.AdministratorAccess)] in Administration area
- [ValidateAntiForgeryToken] on state-changing Admin endpoints

# Roles and Permissions (UI-Inferred)

- Data Maintenance User: Access to Data Maintenance CRUD and audits.
- Month-End Approver (Level 1 / Level 2 / Level 3): Access to corresponding approval screens.
- Operations Analyst: Access to imports, logs, and process dashboards.
- Administrator: Broad access including configuration and audits.

Note: Actual role claims and policies are defined server-side; this section reflects UI groupings and may vary by deployment.

# Configuration

- Application configuration via standard appsettings and environment settings (Development/Production); SPA served by ASP.NET Core host.
- Feature flags or module toggles, if present, are managed via configuration (not enumerated here).

# Dashboard & KPIs

- Process logs and dashboards exist for weekly and monthly cycles (MonthlyProcessLogs, WeeklyProcessLogs); specialized KPIs are module-specific and rendered within the respective views.

# Evidence

- Screen list matches ExampleAppDescriptions/InvestInsightViewsHierarchy.md and SPA view structure under ClientApp/src/views.
- Backend capabilities indicated by presence of controllers, services, and Web API filters in the source tree.

# Key Field Tables (Selected Screens)

These tables list primary inputs we can confirm from requirements and routed screens. Additional fields may be present in the actual views.

## Custom Holding Add (Route: /CustomHoldingAdd)

| Field            | Type    | Required | Source / Control | Notes                         |
| ---------------- | ------- | -------- | ---------------- | ----------------------------- |
| PortfolioCode    | Lookup  | Yes      | Dropdown         | Select portfolio to associate |
| InstrumentCode   | Lookup  | Yes      | Dropdown         | Select instrument to capture  |
| Amount / Value   | Numeric | Yes      | Input            | Amount of the holding         |
| Notes (optional) | Text    | No       | Textarea         | Optional description/remarks  |

Note: PortfolioCode and InstrumentCode are explicitly required per requirements; other fields follow standard CRUD patterns.

## Instrument Duration Add (Route: /InstrumentDurationAdd)

| Field          | Type    | Required | Source / Control | Notes                                |
| -------------- | ------- | -------- | ---------------- | ------------------------------------ |
| Instrument     | Lookup  | Yes      | Dropdown         | Instrument to which values apply     |
| Duration       | Numeric | Yes      | Input            | Duration value                       |
| YTM            | Numeric | Yes      | Input            | Yield-to-Maturity value              |
| Effective Date | Date    | No       | Date Picker      | If present; varies by implementation |

Assumption: Duration & YTM are captured together on add; Effective Date may be present depending on configuration.

## Index Prices Update (Route: /IndexPricesUpdate)

| Field         | Type    | Required | Source / Control | Notes                          |
| ------------- | ------- | -------- | ---------------- | ------------------------------ |
| Index         | Lookup  | Yes      | Dropdown         | Target index (code/name)       |
| Price         | Numeric | Yes      | Input            | Index price value              |
| Price Date    | Date    | Yes      | Date Picker      | Valuation date for the price   |
| Source (opt.) | Text    | No       | Input            | Optional source/reference note |

Assumptions: Field names reflect a standard index pricing CRUD pattern. Currency and precision are handled by backend configuration.

## Instrument Beta Add (Route: /InstrumentBetaAdd)

| Field        | Type    | Required | Source / Control | Notes                                     |
| ------------ | ------- | -------- | ---------------- | ----------------------------------------- |
| Instrument   | Lookup  | Yes      | Dropdown         | Instrument the beta applies to            |
| Beta         | Numeric | Yes      | Input            | Beta value                                |
| As Of Date   | Date    | No       | Date Picker      | Optional date; defaults to current period |
| Notes (opt.) | Text    | No       | Textarea         | Optional description/remarks              |

Assumptions: As Of Date is optional; validation enforces numeric Beta within configured bounds.

## Projected Cash Flow Values Add (Route: /ProjectedCashFlowValuesAdd)

| Field        | Type    | Required | Source / Control | Notes                               |
| ------------ | ------- | -------- | ---------------- | ----------------------------------- |
| Portfolio    | Lookup  | Yes      | Dropdown         | Portfolio to which cashflow applies |
| Currency     | Enum    | Yes      | Dropdown         | ZAR or USD (per requirements)       |
| Amount       | Numeric | Yes      | Input            | Projected cashflow amount           |
| Value Date   | Date    | Yes      | Date Picker      | Applicable week date                |
| Notes (opt.) | Text    | No       | Textarea         | Optional remarks                    |

Behavior: Once projected cashflows exist for ZAR and USD, the Capture button hides and a Complete Projected Cashflow button appears.

## Actual Cash Flow Values Add (Route: /ActualCashFlowValuesAdd)

| Field      | Type    | Required | Source / Control | Notes                                         |
| ---------- | ------- | -------- | ---------------- | --------------------------------------------- |
| Portfolio  | Lookup  | Yes      | Dropdown         | Portfolio for the actual cashflow             |
| Currency   | Enum    | Yes      | Dropdown         | ZAR or USD                                    |
| Amount     | Numeric | Yes      | Input            | Auto-filled baseline; editable; not deletable |
| Value Date | Date    | Yes      | Date Picker      | Applicable week date                          |

## Proposed Cash Flow Values Add (Route: /ProposedCashFlowValuesAdd)

| Field      | Type    | Required | Source / Control | Notes                           |
| ---------- | ------- | -------- | ---------------- | ------------------------------- |
| Portfolio  | Lookup  | Yes      | Dropdown         | Portfolio for proposed cashflow |
| Currency   | Enum    | Yes      | Dropdown         | ZAR or USD                      |
| Amount     | Numeric | Yes      | Input            | Proposed amount                 |
| Value Date | Date    | Yes      | Date Picker      | Applicable week date            |

Completion Rule: Show Complete Cashflow Capture only when Proposed totals equal Actual totals per currency.

## Approvals (Levels 1–3)

| Field            | Type | Required        | Source / Control | Notes                                |
| ---------------- | ---- | --------------- | ---------------- | ------------------------------------ |
| Rejection Reason | Text | Yes (on reject) | Modal Textarea   | Captured when rejecting at any level |

Availability: L1/L2/L3 screens are accessible only after Data Confirmation.

## Reject Final Reports (Route: /RejectFinalReportsView)

| Field            | Type | Required | Source / Control | Notes                                         |
| ---------------- | ---- | -------- | ---------------- | --------------------------------------------- |
| Rejection Reason | Text | Yes      | Modal Textarea   | Returns workflow to Prepare Data after submit |

## Upload Screens

### Portfolio Imports Upload (Route: /PortfolioImportsUpload)

| Field     | Type   | Required | Source / Control | Notes                     |
| --------- | ------ | -------- | ---------------- | ------------------------- |
| File      | File   | Yes      | File Picker      | Portfolio file to process |
| Portfolio | Lookup | Yes      | Dropdown         | Target portfolio          |

### Other Imports Upload (Route: /OtherImportsUpload)

| Field         | Type | Required | Source / Control | Notes                            |
| ------------- | ---- | -------- | ---------------- | -------------------------------- |
| File          | File | Yes      | File Picker      | Bloomberg/Custodian file to load |
| Source (opt.) | Text | No       | Input            | Optional source label            |

### Index Prices Upload (Route: /IndexPricesUploadFile)

| Field | Type | Required | Source / Control | Notes                       |
| ----- | ---- | -------- | ---------------- | --------------------------- |
| File  | File | Yes      | File Picker      | Index prices file to import |

### Instrument Static Upload (Route: /InstrumentStaticUploadFile)

| Field | Type | Required | Source / Control | Notes                          |
| ----- | ---- | -------- | ---------------- | ------------------------------ |
| File  | File | Yes      | File Picker      | Instrument static file to load |

## Report Comments Add (Route: /ReportCommentsAdd)

| Field           | Type | Required | Source / Control | Notes                       |
| --------------- | ---- | -------- | ---------------- | --------------------------- |
| Report Date     | Date | Yes      | Dropdown/Picker  | Target reporting month/date |
| Comment         | Text | Yes      | Textarea         | The report comment          |
| Category (opt.) | Text | No       | Dropdown/Input   | Optional category/tag       |

## Credit Ratings Update (Route: /CreditRatingsUpdate)

| Field                 | Type   | Required | Source / Control | Notes                                 |
| --------------------- | ------ | -------- | ---------------- | ------------------------------------- |
| Instrument/Issuer     | Lookup | Yes      | Dropdown         | Entity for which rating is updated    |
| Local Rating          | Enum   | Yes      | Dropdown         | Local scale                           |
| International Rating  | Enum   | Yes      | Dropdown         | International scale                   |
| Effective Date (opt.) | Date   | No       | Date Picker      | If tracked; depends on implementation |

Assumptions: Specific rating scales depend on configured credit rating scale data.
