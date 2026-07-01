# useGridOverload

## Manages
Planetary power grid overload monitoring and meltdown prevention. Calculates per-reactor meltdown risk (based on load ratio, stability, efficiency), auto-triggers events at thresholds, supports emergency SCRAM and stabilization.

## Returns
- `events` — overload event history (enriched with reactor data)
- `risk` — `GridRiskAssessment` (overall risk, per-reactor risks, cascade probability, load %, status)
- `isLoading`, `error` — state
- `resolveEvent(eventId)` — mark event resolved
- `scramReactor(reactorId)` — emergency shutdown a reactor
- `triggerEmergencyStabilization()` — shed low-priority loads
- `refresh` — re-fetch events and recalculate risk

## Used by
- Power grid management UI
- Reactor monitoring dashboard
