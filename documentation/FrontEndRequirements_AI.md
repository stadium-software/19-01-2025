# Front End Requirements

## Home

This page should have 2 tabs:

- Report Batches
  
  - This should show the last few monthly report batches and their statuses

- New Report Batch
  
  - This should have a button that can initiate a new monthly report batch

## Monthly Process

### Portfolio File Dashboard

This dashboard should have a view of all the different files that can be imported by each portfolio on the system.

Per portfolio:

- Instrument Static

- Holdings

- Transactions

- Income

- Cash

- Performance

- Fees

It should also have a button on the main grid to re-import the portfolio.

When the icon for each file is clicked (this icon should represent the status of the file - this is gotten from the API) the following should happen:

- There should be a popup that shows the step that the import is currently in
  
  - It also should show a back button, a cancel file button which deletes the file and clears the tables as well as a retry validation button in case the file is in the FixData status where it can be retried

- Within the same popup, there should be a tab where you can upload the file onto the front end for processing

### Other File Dashboard

The other file dashboard should have clickable icons like the portfolio file dashboard however, this is for Bloomberg and custodian files and there is just 1 file per row on this dashboard.

The popups on this page are the same as the ones once clicked on the icon on the Portfolio File Dashboard page.

## Instrument Static

This page should have all the instruments to be viewed with their statuses.

It should also have the capability to collapse the status and check columns as well as having a toggle to view all information or just the summary data on the datagrid (otherwise it is a CRUD screen).

It should have a button to export isins which exports an excel document with all the isins that are incomplete on the system.

It has another button to upload an instrument file, this will produce a popup that is the same as the popup used on the portfolio file dashboard when clicking on a status icon of a specific file.

## Credit Rating

This is a CRUD screen for credit ratings, but it also has the retry Decision Flow button on the top right to retry how the system decides what the final credit ratings are for local and international ratings.

## Index Prices

This is a simple CRUD Screen for the Index Prices in the system where you can view the history of each record and all the normal CRUD functions.

## Duration & YTM

This is a CRUD screen for the Instrument Duration and Yield to maturities.

## Beta

This is a CRUD screen for the Instrument Betas to be managed.

## Custom Holding Capture

This is a crud screen for custom holdings such as fixed deposits to be captured.

The capturing of the custom holdings has the following dropdowns: PortfolioCode and InstrumentCode.

## Data Confirmation

This is a page that handles the summary of the data in the preparation phase so that the user can review the data before confirming it.

There are 3 tabs on this page:

- File Check
  
  - Gives an overall expected file count comparted to the actual file count per assetmanager, Bloomberg and custodian.

- Main Data Check
  
  - This is a check to see if all the required sections that are on the 2 file import dashboards actually contain data in the database (even if the files have been imported on the dashboard, is there actually data in the system from those files).
    
    - Asset Managers Data Check
    
    - Custodian Data Check
    
    - Bloomberg Holdings Data Check

- Other Data Check
  
  - This checks the following tables to see if all the data has been completed (incomplete record count per table):
    
    - Index Prices
    
    - Duration & YTM
    
    - Credit Ratings
    
    - Beta
    
    - Instruments

## Approve

### Approve Level 1

This is where level 1 approvers can go once the data has been confirmed (no other time) to do the first level of approval.

They can also reject it and capture a rejection reason when rejecting.

## Approve Level 2

This is where level 2 approvers can go once the data has been confirmed (no other time) to do the second level of approval.

They can also reject it and capture a rejection reason when rejecting.

### Approve Level 3

This is where level 3 approvers can go once the data has been confirmed (no other time) to do the final level of approval.

They can also reject it and capture a rejection reason when rejecting.

### Approve Level 1

This is where level 1 approvers can go once the data has been confirmed (no other time) to do the first level of approval.

They can also reject it and capture a rejection reason when rejecting.

### Reject Final Reports

This is where the level 3 approvers can go if it has been fully approved to still reject it and take it back to the prepare data status (all rejections go back to this step).

## Process Logs

### Monthly

This page has a filter on a report date that is a drop down.

You can view the Monthly process logs (the steps that the monthly workflow has gone through, audit trail) as well as the Report Batch Approval Logs (who has approved/ rejected and when).

Both of these datagrids are searchable and exportable to excel.

### Files

This also has a filter for the report date at the top as a dropdown.

This then displays all the files that have been imported into the system as well as showing their status and a download button to download and look at the file.

## Data Maintenance

This main menu item contains all the general CRUD screens within the system. The following sub menu items are detailed below and all have CRUD screens linked to them:

- Asset Class Group Limits
- Asset Class Group Maps
- Asset Class Groups
- Asset Managers
- Benchmarks
- Budget Performance
- Countries
- Credit Rating Group Portfolio Limits
- Credit Rating Scales
- Currencies
- Custody Fee Rate
- File Settings
- Finance Account Codes
- Indexes
- Management Fee Rate
- Portfolio Asset Class Limits
- Portfolio Exclusions
- Portfolios
- Report List
- Tranche Portfolio Setup

## Transformations

This has 2 sub menu items that are both simple CRUD screens:

- Transforms
- Asset Manager Transforms

## Reports

This menu item has 2 sub menu items:

- Report Comments
  - CRUD screen for report comments
- Credit Rating Changes
  - Viewing the changes of credit ratings on a data grid compared to the previous month’s credit ratings

## Full Audit Trails

This menu item has the following sub menu items and these items are all the same screen that shows the versions of each record in each table for auditing purposes (Full audit trail) for the following tables all split into their same screens (they are all searchable and exportable to excel datagrids):

- Index
- Benchmark
- Custody Fee Rate
- Management Fee Rate
- Credit Rating
- Custom Holding
- Instrument
- Beta
- Duration & YTM
- Other Transforms
- Asset Manager Transforms
- Asset Manager
- Portfolio
- Tranche Portfolio Setup
- Portfolio Asset Class Limits
- Asset Class Group Limits
- Credit Rating Group Portfolio Limits

## Weekly Process

### Cashflow

When clicking on this menu item, it looks at the status of the weekly report batch to see which step it should be in and therefore which page it should take you to. One of the following:

- Projected Cashflows
  
  - Capture the projected cashflows
    
    - Has capture projected cashflow button
      
      - Once a cashflow has been captured for ZAR and USD currencies, the capture button vanishes and the Complete Projected cashflow button appears at the bottom of the data grid
      
      - The 2 projected cashflows can be edited and deleted and are shown on a data grid
    
    - This page, like the other 2, has a visual at the top showing which of the 3 steps in the sequence you are currently in

- Actual Cashflows
  
  - This comes after the user has clicked the complete projected cashflows button
  
  - There is a visual at the top showing which step you are currently in for the weekly process
  
  - This page has 2 data grids:
    
    - Actual Cash Flow
      
      - This is auto filled but you can edit the values (not delete)
    
    - Proposed Cashflow
      
      - This is a datagrid showing the proposed cashflows (starts as empty and has an Enter Proposed Cashflows button below it)
      
      - You can edit and delete these values
      
      - 

- The button logic on this page is as follows:

Only show the complete Cashflow Capture button when the proposed cashflows per currency equal the actual cashflows per currency (the currency is determined in the proposed through the currency of the portfolio)
Once this is fulfilled, the user can click on the Complete Cashflow Capture Button

### Cashflow Rebalancing Recommendations

This comes after the user has clicked the Complete Cashflow Capture Button
There is a visual at the top showing which step you are currently in for the weekly process
There is a dropdown for currency at the top of the page which filters all 4 datagrids on the page to that currency (based on the portfolio currencies linked) (ZAR or USD)
It has the following  read-only datagrids below each other:

- Projected Cashflow
- Actual Cashflow
- Proposed Cashflow
- Calculated Cashflows
- It has the following buttons at the bottom:
- Adjust Projected Cashflows

Takes the user back to the Projected cashflows step in the process and the accompanying page
Adjust Actual Cashflows
Takes the user back to the Actual cashflows step in the process and the accompanying page

- Complete Batch
- Completes the weekly batch and initiates one for the next week

## Historic Cashflow

This page is the same as the Cashflow Rebalancing Recommendations page, however, it does not have buttons at the bottom and has another dropdown filter at the top of the screen to choose the weekly report batch date next to the currency.
It is used to view the cashflow details for previous weekly batches

## Weekly Process Log

- This page has a dropdown at the top to choose the report batch date
- Once chosen, it shows the following data grids next to each other:
- Weekly Process Logs

Shows all the steps that the backend process has gone through for that weekly report batch
User Audit Trail
Shows all the user actions and when they captured each step in the process flow
Both of these grids are exportable to excel
