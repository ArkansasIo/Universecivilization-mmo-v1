# usePlanetaryEvents

Manages time-limited planetary events with player choices and resource effects.

## Returns

- `events` — active planetary events with type, choices, duration
- `loading` — boolean for initial load
- `generateRandomEvent(planetId)` — creates a new random event from templates
- `makeChoice(eventId, choiceId)` — resolves an event by applying the chosen effects via RPC
- `refreshEvents` — reloads from Supabase

## Event Templates

- Meteor Shower, Solar Flare, Alien Artifact Discovery, Pirate Raid, Resource Discovery, Planetary Festival

## Features

- Colony / planet management
- Branching event choices
- Resource rewards and penalties
