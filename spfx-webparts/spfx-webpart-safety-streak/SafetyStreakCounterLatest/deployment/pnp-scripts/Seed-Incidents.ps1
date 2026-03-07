param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$ListTitle = "Incidents",

  [Parameter(Mandatory = $false)]
  [string]$SeedPath = "..\sample-data\Incidents.sample.json"
)

Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

Write-Host "Loading seed data from $SeedPath" -ForegroundColor Cyan
$seedJson = Get-Content -Path $SeedPath -Raw | ConvertFrom-Json

foreach ($entry in $seedJson) {
  Write-Host "Adding incident for $($entry.IncidentDateTime)" -ForegroundColor Gray
  Add-PnPListItem -List $ListTitle -Values @{ IncidentDateTime = $entry.IncidentDateTime; IncidentTitle = $entry.IncidentTitle }
}

Write-Host "Seed data load completed." -ForegroundColor Green
