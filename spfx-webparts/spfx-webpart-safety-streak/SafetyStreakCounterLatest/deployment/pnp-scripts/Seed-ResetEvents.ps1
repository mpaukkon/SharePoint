param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$ListTitle = "ResetEvents",

  [Parameter(Mandatory = $false)]
  [string]$SeedPath = "..\sample-data\ResetEvents.sample.json"
)

Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

Write-Host "Loading seed data from $SeedPath" -ForegroundColor Cyan
$seedJson = Get-Content -Path $SeedPath -Raw | ConvertFrom-Json

foreach ($entry in $seedJson) {
  Write-Host "Adding reset event for $($entry.ResetEffectiveDate)" -ForegroundColor Gray
  Add-PnPListItem -List $ListTitle -Values @{ ResetEffectiveDate = $entry.ResetEffectiveDate }
}

Write-Host "Seed data load completed." -ForegroundColor Green
