# useTutorialSystem

Manages interactive tutorials — step-by-step guides with target highlights and navigation actions.

## Returns

- `activeTutorial` — the currently running tutorial (steps, current step, completion)
- `showTutorial` — whether the tutorial overlay is visible
- `tutorialsCompleted` — array of completed tutorial IDs
- `startTutorial(tutorialId)` — begins a tutorial (skips if already completed)
- `nextStep()` / `previousStep()` — navigation through tutorial steps
- `skipTutorial()` — exits the current tutorial
- `resetTutorials()` — clears all completion state

## Available Tutorials

- **Getting Started** — welcome, resources, buildings, research, fleet (5 steps)
- **Combat Basics** — fleet overview, sending fleets, combat simulator (3 steps)

## Features

- Interactive onboarding
- Target element highlighting
- Action routing (navigate to pages)
- LocalStorage persistence of progress
