param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl
)

Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

Write-Host "Applying ResetEvents template" -ForegroundColor Cyan
Invoke-PnPProvisioningTemplate -Path "..\pnp-provisioning\ResetEvents.xml"

Write-Host "Applying Incidents template" -ForegroundColor Cyan
Invoke-PnPProvisioningTemplate -Path "..\pnp-provisioning\Incidents.xml"

Write-Host "Validating lists" -ForegroundColor Cyan
$reset = Get-PnPList -Identity "ResetEvents" -ErrorAction SilentlyContinue
$incidents = Get-PnPList -Identity "Incidents" -ErrorAction SilentlyContinue

if (-not $reset) {
  throw "ResetEvents list not found after provisioning."
}

if (-not $incidents) {
  throw "Incidents list not found after provisioning."
}

Write-Host "Provisioning completed." -ForegroundColor Green
