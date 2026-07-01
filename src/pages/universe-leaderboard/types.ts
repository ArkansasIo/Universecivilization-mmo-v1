export interface MyEmpireConfig {
  universeId: string;
  empireId: string;
}

export const MY_EMPIRE_KEY = 'ued_my_empire';

export function loadMyEmpire(): MyEmpireConfig | null {
  try {
    const raw = localStorage.getItem(MY_EMPIRE_KEY);
    return raw ? (JSON.parse(raw) as MyEmpireConfig) : null;
  } catch {
    return null;
  }
}

export function saveMyEmpire(cfg: MyEmpireConfig | null) {
  if (cfg) localStorage.setItem(MY_EMPIRE_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(MY_EMPIRE_KEY);
}
