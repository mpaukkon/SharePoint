param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$TemplatePath = "..\pnp-provisioning\ResetEvents.xml",

  [Parameter(Mandatory = $false)]
  [string]$ListTitle = "ResetEvents"
)

Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

Write-Host "Applying template $TemplatePath" -ForegroundColor Cyan
Invoke-PnPProvisioningTemplate -Path $TemplatePath

Write-Host "Ensuring list '$ListTitle' exists" -ForegroundColor Cyan
$list = Get-PnPList -Identity $ListTitle -ErrorAction SilentlyContinue
if (-not $list) {
  throw "List '$ListTitle' was not created. Check provisioning template output."
}

Write-Host "ResetEvents provisioning completed." -ForegroundColor Green
