# useBlueprintSystem

## Manages
EVE-style blueprint jobs: manufacturing, material/time efficiency research, copying, invention. Handles job creation, progress polling (5s), claiming, cancelling, and dark-matter speed-ups.

## Returns
- `jobs` — in-progress blueprint jobs
- `completedJobs` — jobs awaiting claiming
- `inventionResults` — results of completed invention jobs
- `loading`, `maxSlots` — state
- `startManufacturing`, `startResearch`, `startCopying`, `startInvention` — job starters
- `claimJob`, `cancelJob`, `speedUpJob` — job management
- `getActiveSlots` — count of active job slots
- `getManufacturingTime`, `getResearchTime`, `getCopyTime`, `getInventionTime`, `formatTime` — utility functions

## Used by
- Blueprint manufacturing UI
- Research and invention screens
