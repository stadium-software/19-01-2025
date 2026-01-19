InvestInsight — Human-Readable Product Guide

Purpose: This guide explains what InvestInsight does, how the main screens fit together, and the typical user journeys for getting work done. It’s written for humans first — no deep technical details — so new team members and stakeholders can quickly understand the app.

What InvestInsight Is

- Portfolio reporting and oversight: Helps investment teams prepare weekly and monthly reports from multiple data sources.
- Data stewardship: Ensures instrument, index, credit rating, and pricing data stays complete and up to date.
- Governance and audit: Provides multi‑level approvals, comments, and full audit trails for key changes.

Who Uses It

- Investment operations: drives weekly cashflow reconciliation and report preparation.
- Portfolio managers/analysts: reviews data, adds comments, and initiates corrections.
- Approvers (L1 → L3): verify packs and sign off before publishing.
- Administrators: manages users/roles and page access.

Key Outcomes

- Accurate weekly/monthly portfolio packs published on time.
- Transparent data lineage: who changed what, when, and why.
- Faster corrections: focused screens for instruments, prices, durations, betas, ratings.

Core Concepts

- Report Batch: a reporting cycle (usually a week) that groups all data and approvals.
- Data Checks: guided tabs to verify completeness and quality of loaded data.
- Approvals: staged sign‑offs (Level 1, 2, 3) with reject and rework loops.
- Audit Trails: every change to master data is viewable (history + full audit screens).

How The App Fits Together

- Home & Start: high‑level entry point to kick off a new report batch and see status.
- Data Intake: SFTP or file uploads bring in holdings, prices, and other feeds.
- Data Confirmation: guided checks highlight what needs attention before approval.
- Maintenance Screens: instruments, index prices, durations, betas, ratings — add/update with history.
- Approvals & Comments: staged approvals, rejections with reasons, and report commentary.
- Logs: file, monthly, and weekly process logs support troubleshooting.
- Admin: user, role, and page access management.

Primary Userflows

1. Weekly Report Cycle (end‑to‑end)

- Create/continue batch: Start a new week on the Start Page. The system sets up the batch and required tasks.
- Load data: Use SFTP Import or Portfolio/Other Imports to bring in source files. Resolve any ingestion warnings.
- Confirm data: Open Data Confirmation — work through tabs (main file checks, other checks, portfolio re‑imports) until everything is green.
- Fix issues fast: If you find gaps, jump to targeted screens:
  - Instruments: add/update instrument static details.
  - Index Prices: upload/update missing prices; see history.
  - Durations & YTM: add or edit instrument duration points.
  - Betas: add or adjust instrument betas.
  - Credit Ratings: update latest ratings and review changes.
- Add comments: Capture context in Report Comments for the batch.
- Approve in stages:
  - Level 1: initial review of data completeness and key checks.
  - Level 2: portfolio‑level confirmation and risk checks.
  - Level 3: final sign‑off; if rejected, provide a reason and loop back to fix.
- Publish/Complete: Once L3 is approved, the batch is complete and reports are ready for distribution.

2. Data Maintenance (on demand or during checks)

- Instruments: Add new instruments or refine attributes. Use history/audit to see prior changes.
- Index Prices: Update or upload price files; check price history and popups for details.
- Durations & YTM: Maintain duration curves; audit trail shows edits over time.
- Betas: Maintain instrument/issuer betas; audit and history views available.
- Credit Ratings: Refresh ratings and view change summaries.

3. Cashflow Capture (if applicable)

- Projected Cashflows: Enter upcoming inflows/outflows by portfolio and currency.
- Actual Cashflows: Confirm what happened; amounts can baseline from projections.
- Proposed Cashflows: Adjust to match actuals by currency before finalizing.

4. Troubleshooting and Monitoring

- File Process Logs: Inspect each file’s journey and any faults.
- Weekly/Monthly Process Logs: Review the end‑to‑end job steps, timings, and errors.

5. Monthly Report Cycle (end‑to‑end)

- Plan the month: Open Monthly Process Workflow to see the checklist of month‑end tasks and dependencies.
- Consolidate period: Ensure all weekly batches in the month are complete and approved.
- Load month‑end files: Import month‑end holdings, valuations, and any required feeds (via SFTP or Uploads). Resolve ingestion issues early.
- Month‑specific checks: Use Data Confirmation (and month‑end tabs where applicable) to validate completeness, benchmarks, budget performance, and fees.
- Fix issues fast: Use Instruments, Index Prices, Durations, Betas, and Credit Ratings screens as needed; audit/history supports review.
- Prepare narrative and packs: Add Report Comments and verify required items in Report List.
- Approvals: Follow L1 → L3 with emphasis on month‑end reconciliations and exceptions.
- Publish/Complete: Finalize the month; Monthly Process Logs capture steps, timings, and outcomes.

Screen Tour (What you’ll see and why it matters)

- Start Page: Kicks off new report batches and shows current status.
- SFTP Import & Uploads: Lets you bring data into the app from feeds or local files.
- Data Confirmation: A single place to verify everything is complete; guides you to fixes.
- Portfolio Imports & Other Imports: Manage feed‑specific uploads, re‑imports, and validations.
- Instruments: Create/update instrument master data; see audit trails and history.
- Index Prices: Update/upload prices and browse history; quickpop views help resolve gaps.
- Durations & YTM: Maintain instruments’ duration data with full history.
- Instrument Betas: Add/edit betas; audit ensures changes are governed.
- Credit Ratings: Update ratings and monitor changes across portfolios.
- Report Comments: Capture commentary tied to the reporting period.
- Approvals (L1, L2, L3): Sequential sign‑offs; rejection returns you to fixes with reasons captured.
- Monthly Process Workflow: Orchestrates month‑end tasks and dependencies; see progress at a glance.
- Logs (File, Weekly, Monthly): Evidence for operations and debugging.
- Administration: Manage users, roles, and page access; state‑changing actions are protected.

Role‑Based Journeys (quick guides)

- Operations Lead:
  1. Start new batch → 2) Trigger/verify imports → 3) Work Data Confirmation → 4) Assign fixes → 5) Nudge L1.
- Analyst:
  1. Investigate Data Confirmation issues → 2) Update instruments/prices/durations/betas/ratings → 3) Add report comments.
- Approver (L1/L2/L3):
  1. Open Approvals → 2) Review data checks & comments → 3) Approve or Reject with reason.
- Administrator:
  1. Manage users/roles → 2) Adjust page access → 3) Support audit inquiries.

Quality & Governance Features

- Full Audit Trails: Dedicated views for every master data entity.
- History Views: Quick comparisons across dates/versions.
- Guided Checks: Data Confirmation funnels you to what matters.
- Rejection Reasons: Enforced rationale for L3 rejections; aids traceability.

Glossary

- Batch: A discrete reporting period (typically weekly).
- Data Confirmation: Guided verification steps to ensure readiness for approval.
- L1/L2/L3: Staged approvals, increasing scrutiny at each level.
- Maintenance Screens: Focused areas to correct or enrich data.

Getting Started (new teammate)

- Skim Start Page and Data Confirmation to understand the current week’s health.
- Click into Index Prices and Instruments to see how edits and audits look.
- Open Approvals to understand the stages and what reviewers check.

Where to Go Next

- Need routes, fields, and APIs? See the technical description in the sibling document for exact paths, tables, and endpoint maps.
