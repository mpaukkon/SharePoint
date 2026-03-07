# Safety Streak Counter (Phase 1 Starter Scaffold)

This repository contains a **spec-aligned starter scaffold** for the Safety Streak Counter SPFx web part architecture.

## What is included

- Layered architecture under `src/webparts/safetyStreakCounter/`
- Domain calculation logic for days-since counter
- Repository + service abstractions for ResetEvents read path
- React layout component placeholders
- Unit tests for counter semantics and service state mapping

## Notes

- This is a lightweight scaffold to accelerate implementation from the specification.
- It is **not yet a full generated SPFx solution** (no Yeoman SPFx generator output yet).
- The structure and contracts are designed to drop into an SPFx project with minimal refactoring.

## Try tests

```powershell
npm install
npm test
```
