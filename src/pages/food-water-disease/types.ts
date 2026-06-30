export interface PRPState {
  activeUntil: number | null;   // timestamp ms
  cooldownUntil: number | null; // timestamp ms
  activatedForColony: string | null;
}