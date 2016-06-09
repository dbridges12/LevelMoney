# LevelMoney
## Requirements
* Load transactions from the GetAllTransactions endpoint
* Display Income and Spend(Expenses) aggregated by month for entire data set
* Display Monthly Average Income and Expenses

## Additional Features
* Filter to ignore spending on Donuts
* Filter to remove Credit card credit/debit transactions from aggregates

## Special Features
* Display Monthly Remaining Balance (income - expense)
* Highlight Credit Card transactions that don't have a matching credit or debit
* Additional Features from above are implemented in a drop down list

# Getting Started
* Here's the online demo: http://dbridges12.github.io/LevelMoney/index.html
* Click on Connect button on landing page
  * This will read data from GetAllTransactions API
  * Then will display Grid with all transactions aggregated by year and month and credit/debit
  * Grid is sortable by clicking on heading
  * Grid columns can be moved right or left
* Top of grid shows Average monthly income and spend
* Top right of grid has an options drop down menu
  * All transactions uses all transactions to display data
  * Ignore donuts removes all donut expenses form the spend column for each month
  * Remove C.C. Payments 
    * Removes credit card credits and debits from the aggregate amount
    * Shows a list beneath the main list with each transaction removed
    * Hightlights in the description when a mathcing credit/debit was not found based on 24 hour criteria
    
## Final notes
* App uses Angular framework
* Source is commented
