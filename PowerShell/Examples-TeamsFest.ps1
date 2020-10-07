#Notice! Install latest version of MicrosoftTeams PowerShell module first with "Install-Module MicrosoftTeams"

$session = New-CsOnlineSession
Import-PSSession $session -AllowClobber

#Opt-in meeting recording to SharePoint/OneDrive for all meeting policies
Get-CsTeamsMeetingPolicy | foreach-object {Set-CsTeamsMeetingPolicy -RecordingStorageMode "OneDriveForBusiness" -Identity $_.Identity}
Get-CsTeamsMeetingPolicy | ft Identity, RecordingStorageMode


#Enable attendee list to Global policy
Set-CsTeamsMeetingPolicy -Identity Global -AllowEngagementReport "Disabled"
Get-CsTeamsMeetingPolicy | ft Identity, AllowEngagementReport

#Background effects: NoFilters, BlurOnly, BlurandDefaultBackgrounds, AllFilters
Set-CsTeamsMeetingPolicy -Identity Global -VideoFiltersMode "BlurOnly"
Get-CsTeamsMeetingPolicy | ft Identity, VideoFiltersMode

#Priority messages.
Set-CsTeamsMessagingPolicy -Identity Global -AllowPriorityMessages $false
Get-CsTeamsMessagingPolicy | ft Identity, AllowPriorityMessages
