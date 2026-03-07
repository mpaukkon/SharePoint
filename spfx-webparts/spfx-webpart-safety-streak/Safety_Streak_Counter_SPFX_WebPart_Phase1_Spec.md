# Safety Streak Counter — SharePoint SPFx Web Part (Phase 1) — Technical Specification

## 0. Purpose & Context

This specification defines the **Phase 1** implementation of a **SharePoint Framework (SPFx) client-side web part** that renders the **Safety Streak Counter** on modern SharePoint pages. The web part’s primary responsibility is to display a single, company-wide value: **“Days since last qualifying safety event”**, derived from the **ResetEvents** list.

The web part is part of a broader system where incidents are recorded, evaluated, and (when qualifying) converted into immutable reset events; the counter must be derived from reset events, not directly from incident records.

> Note: A broader product spec exists and includes AI-assisted risk interpretation, ingestion workflow, and data model. This document focuses only on the **SharePoint web part** for Phase 1.

---

## 1. Scope

### 1.1 In scope (Phase 1)

The SPFx web part shall:

1) **Read ResetEvents** from a configured SharePoint list.
2) **Determine the latest ResetEffectiveDate** from ResetEvents.
3) **Compute and display**:
   - `DaysSinceLastQualifyingSafetyEvent` = days between “now” and latest `ResetEffectiveDate` using site regional timezone semantics.
4) Support the **authoritative layout patterns** (visual emphasis only; same semantics across layouts):
   - Ritual layout (default), Context layout, Display layout.
5) Provide a **configurable property pane** for list source selection and layout selection (details in §6).
6) Render correctly on modern SharePoint pages.

### 1.2 Out of scope (Phase 1)

Not required in Phase 1 (may be added later):

- Incident intake UX (Forms) or workflow implementation.
- AI risk interpretation, risk taxonomy display, or AI confidence review UX.
- Supporting metrics (rolling 180d, 90d trend) are optional and **not required** for Phase 1 unless explicitly included in Phase 1 build decision. The core time semantics exist in the broader spec.
- Site-scoped or location-filtered counters (future support).

---

## 2. Functional Requirements

### 2.1 Counter Semantics (must)

- The web part **must derive** its counter value **only from ResetEvents**, not directly from Incidents.
- The web part **must compute** the displayed value from the **latest ResetEffectiveDate**.
- ResetEffectiveDate must be treated as the authoritative timestamp for resets (in the data model, ResetEffectiveDate MUST equal IncidentDateTime for a reset event).

### 2.2 Layout Behaviour (must)

- Layouts change **visual emphasis only**; calculations and semantics are identical across layouts.
- Layout patterns:
  - **Ritual layout (default):** Counter visually dominant and central, intended for intranet homepages and shared displays.
  - **Context layout:** Counter and supporting context balanced, intended for safety/leadership pages.
  - **Display layout:** Minimal, non-interpretive layout for TVs/public spaces.
- Across all layouts:
  - Counter remains primary element
  - Colours are neutral and consistent
  - No rankings, targets, or thresholds shown
  - Layout must not change metric meaning

### 2.3 Time Semantics (must)

Phase 1 must implement the counter using site regional timezone semantics; the broader spec defines time windows for later supporting metrics:

- Calculations use **IncidentDateTime in site regional timezone**.
- (For later phases if enabled) six-month metric = rolling **180 days**, trend = rolling **90-day comparison**.

### 2.4 Edge Cases (must)

- If no ResetEvents are found:
  - Web part must display a defined “no data” state (copy to be decided), and must not crash.
- If list access is denied:
  - Web part must display a defined “access not available” state and must not expose sensitive details.

(Implementation details are design recommendations; behaviour is required.)

---

## 3. Data Sources & Contracts

### 3.1 SharePoint Lists

The broader system uses two lists:

- **Incidents** (event intake)
- **ResetEvents** (derived KPI events)

Phase 1 web part depends on **ResetEvents**.

### 3.2 ResetEvents Fields Used by Web Part (Phase 1)

Minimum required fields to compute the counter:

- `ResetEffectiveDate` (DateTime)

Additional fields may exist and are not required for Phase 1 display (e.g., AIConfidence, risk profile), but can be used for diagnostics later.

### 3.3 Immutability

ResetEvents must remain immutable once created (system-level rule; web part must not attempt to write to ResetEvents).

---

## 4. Non-Functional Requirements

### 4.1 Performance

- Web part should perform efficiently on high-traffic pages (homepages, dashboards, shared screens).
- Recommended: fetch only what is needed (latest ResetEffectiveDate), not entire list history (recommendation; not a hard requirement).

### 4.2 Reliability & Resilience

- Web part must degrade gracefully with user-friendly error states (§2.4).

### 4.3 Maintainability

- Code should separate UI, data access, and calculations to allow later extension without changing semantics.

### 4.4 Accessibility

- Web part must meet basic accessibility requirements (keyboard navigation, screen reader friendly content).

---

## 5. Proposed Architecture (Phase 1)

> This section defines the recommended architecture. It is compatible with the product constraints and supports future extension.

### 5.1 Runtime Components

1) **SPFx Web Part Host**
   - Provides context, property pane configuration, theme context, and page context.
2) **UI Layer (React + Fluent UI)**
   - Renders one of the layout variants.
3) **Service / ViewModel Layer**
   - Coordinates data retrieval and returns a `CounterViewModel`.
4) **Domain Calculation Layer**
   - Pure functions for date handling and “days since” calculation.
5) **Repository Layer**
   - Reads SharePoint list data for ResetEvents.

### 5.2 Suggested Project Structure

```
src/
  webparts/safetyStreakCounter/
    SafetyStreakCounterWebPart.ts
    components/
      SafetyStreakCounter.tsx
      layouts/
        RitualLayout.tsx
        ContextLayout.tsx
        DisplayLayout.tsx
    services/
      SafetyStreakService.ts
    domain/
      counterCalculator.ts
      timeSemantics.ts
      types.ts
    data/
      ResetEventsRepository.ts
      spClient.ts
    models/
      CounterViewModel.ts
```

### 5.3 Data Access Approach (SharePoint)

Phase 1 can use one of the following SPFx-supported approaches:

- **SPHttpClient** for SharePoint REST APIs.
- **PnPjs** as a convenience wrapper (optional).

No Graph is required for Phase 1 unless you add group/role detection via Entra ID.

---

## 6. Configuration (Property Pane)

Phase 1 web part configuration must include:

- `resetEventsList`: list selector (URL, list ID, or relative path; choice is implementation detail)
- `layout`: enum `{ Ritual, Context, Display }` matching the authoritative layout patterns
- (Optional) `titleOverride`: string
- (Optional) `showLastUpdated`: boolean

---

## 7. Rendering Requirements

### 7.1 Common Elements (all layouts)

- Primary display: `DaysSinceLastQualifyingSafetyEvent` (integer days)
- Optional secondary display: `LatestResetEffectiveDate` (formatted)
- No ranking/targets/thresholds.

### 7.2 Layout Definitions (Phase 1)

- **Ritual layout (default):**
  - Counter is visually dominant and central.
  - Minimal secondary information.

- **Context layout:**
  - Counter is prominent but balanced.
  - Reserved area for future supporting metrics (not required in Phase 1).

- **Display layout:**
  - Minimal, high-contrast, large typography for screens.
  - Non-interpretive.

---

## 8. Security & Permissions

- Web part must rely on SharePoint permissions for list access.
- If the user lacks read permission to ResetEvents, show a non-sensitive error state.

The broader spec notes that some metrics may be restricted to Safety Admins (Reporting Health) while Safety Reality is public; Phase 1 web part implements only the public counter unless extended.

---

## 9. Telemetry & Diagnostics (Recommended)

- Recommended: log load failures and “no data” states to console in dev; optionally add Application Insights later.
- Recommended: include “last refreshed” timestamp when debugging shared displays.

---

## 10. Testing Requirements

### 10.1 Unit Tests (Recommended)

- Counter calculation: day difference around midnight boundary in site timezone.
- No ResetEvents behaviour.

### 10.2 Integration Tests (Recommended)

- Reads latest ResetEffectiveDate from a test list.
- Permission-denied scenario.

---

## 11. Deployment & Versioning

- SPFx package deployed to SharePoint App Catalog.
- Versioning must be controlled and documented per release.

---

## 12. Acceptance Criteria (Phase 1)

The Phase 1 web part is accepted when:

1) It renders on a modern SharePoint page and shows a number of days derived from the latest ResetEffectiveDate.
2) It does not use Incidents directly for the counter.
3) Layout selection changes visual presentation only; the value remains identical for the same data.
4) It handles “no data” and “no access” states gracefully without crashing.
5) Property pane allows selecting ResetEvents source and layout.

---

## 13. Implementation Baseline (Informational)

- SPFx is a unified extensibility model across SharePoint and related Microsoft 365 surfaces.
