## To-Do SharePoint Framework Web Part 

This sample web part utilitizes Microsoft Graph API to read and complete user's personal tasks on Microsoft To-Do. Web Part requires Tasks.ReadWrite permission on Graph API. Web Part can be surfaced on both SharePoint and Microsoft Teams tab.

Current SharePoint Framework version: 1.8.0

## Version history
Version|Date|Comments
-------|----|--------
1.0|April 15, 2019|Initial release

## Deployment
* Clone this repository
* Run 'npm install'
* Run 'gulp bundle --ship'
* Run 'gulp package-solution --ship'
* Drop solution package to SharePoint App Catalog
* Select added solution and click 'Sync to Teams' from the ribbon on App Catalog
* Approve API permissions on API Management on SharePoint Admin Center
