# Safety Streak Counter (SPFx Latest)

## Summary

This is the **latest SPFx** implementation of the Safety Streak Counter web part. It reads from the configured **ResetEvents** SharePoint list and displays the days since the last qualifying safety event using site regional timezone semantics.

### Key features

- **ResetEvents-only** calculation (no Incident list dependency)
- **Timezone-aware** day calculation
- **Layouts:** Ritual, Context, Display
- **Graceful no-data + no-access handling**
- **Property pane list picker** for ResetEvents selection

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.22.2-green.svg)

## Prerequisites

- Node **22.14+** (required by SPFx 1.22.2)
- npm 10+

## Getting started

```powershell
npm install
npm run start
```

## Build and package

```powershell
npm run build
```

The `.sppkg` package will be generated at:

```
sharepoint/solution/safety-streak-counter-latest.sppkg
```

## Configuration

In the web part property pane, configure:

- **ResetEvents list name** (list picker)
- **Layout style** (Ritual, Context, Display)
- **Title override** (optional)
- **Show last updated** (optional)

## Deployment notes

1. Upload the `.sppkg` to your SharePoint App Catalog.
2. Approve deployment (or enable it for the tenant if `skipFeatureDeployment` is set).
3. Add the web part to a modern SharePoint page and configure the list.

## List deployment templates

This repo includes two options for provisioning the `ResetEvents` list:

- `deployment/pnp-provisioning/ResetEvents.xml` (PnP Provisioning Template)
- `deployment/list-templates/ResetEvents.json` (generic list template JSON)

Optional Phase 2 templates are included for the `Incidents` list:

- `deployment/pnp-provisioning/Incidents.xml`
- `deployment/list-templates/Incidents.json`

## PnP PowerShell helper scripts

Use these scripts if you prefer PnP PowerShell provisioning:

- `deployment/pnp-scripts/Apply-ResetEventsTemplate.ps1`
- `deployment/pnp-scripts/Apply-IncidentsTemplate.ps1`
- `deployment/pnp-scripts/Apply-AllTemplates.ps1`
- `deployment/pnp-scripts/Seed-ResetEvents.ps1`
- `deployment/pnp-scripts/Seed-Incidents.ps1`

Sample seed data:

- `deployment/sample-data/ResetEvents.sample.json`
- `deployment/sample-data/Incidents.sample.json`

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Heft Documentation](https://heft.rushstack.io/)