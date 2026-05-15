# Estimates Module Implementation Plan

## Current Analysis
The `EstimatesTab.tsx` module currently has the core functionality of viewing a list of estimates, calculating the running total, adding an estimate, and directly deleting an estimate without warning.

## User Requests
Based on your requests, here is the plan to improve the module:

1. **Search Functionality**: Add a search bar to filter estimates by `estimateNumber` or `notes`.
2. **Pagination**: Allow pagination of the summary table to only display 10 estimates per page.
3. **Total Metrics Improvements**: The module already displays "Total Approved Value", but we can also display other useful metrics, like "Total Original Value" and "Total Supplements/Change Orders".
4. **Delete Confirmation**: Implement a dialog that prompts the user to confirm their action before deleting an estimate.

## Additional Improvements
Here are some other ideas to improve the module:
1. **Sorting**: Allow the user to sort the estimates table by clicking on the column headers (e.g., sort by Date Created, Amount).
2. **Date Filters**: Add a date picker range to only show estimates generated within an explicit timeframe.
3. **Export to CSV**: Put a small button to export the current estimates table to an excel / csv document.
4. **Editing Estimates**: Add an "Edit" button next to the "Delete" button, to allow users to fix typos on existing estimates instead of deleting and recreating them.
5. **Chart View**: Incorporate a small line-chart to visualize the running total amount visually over time.

## Task List
Here is the step-by-step task list to implement your initial requests:

- [ ] Add state variables for the search term `searchTerm` and current page `currentPage`.
- [ ] Implement search filtering logic inside the component before pagination.
- [ ] Implement pagination logic to divide the filtered array into slices of 10.
- [ ] Render pagination controls (Previous/Next) at the bottom of the table.
- [ ] Render a search Input element right above the table.
- [ ] Create state variables for a `deleteConfirmId` to track which estimate is selected for deletion.
- [ ] Replace the immediate delete mutate call with opening a `Dialog` pop-up that has a "Confirm" button.
- [ ] Compute extended statistics (e.g. Original Estimate vs Supplements) and render another summary `Card`.

---
Let me know if you would like me to proceed with this task list and implement it! I can also add any of the "Additional Improvements" if they sound useful to you.
