import { useState, useEffect, useRef } from 'react';
import { useTheme, type ThemeName } from '@/hooks/useTheme';

interface ThemeMeta {
  id: ThemeName;
  label: string;
  icon: string;
  previewColor: string;
  description: string;
}

const THEME_META: ThemeMeta[] = [
  {
    id: 'black-style',
    label: 'Cyberpunk',
    icon: 'ri-moon-line',
    previewColor: '#4fd4ff',
    description: 'Dark cyberpunk interface',
  },
  {
    id: 'imperial-gold',
    label: 'Imperial',
    icon: 'ri-vip-crown-line',
    previewColor: '#e2c044',
    description: 'Golden empire command',
  },
  {
    id: 'og-white',
    label: 'Classic',
    icon: 'ri-sun-line',
    previewColor: '#3b82f6',
    description: 'Clean light interface',
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMeta = THEME_META.find((t) => t.id === theme) || THEME_META[0];

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={containerRef} className="relative theme-switcher">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/5"
        style={{
          color: open ? 'oklch(var(--sd-text-highlight))' : 'oklch(var(--sd-text-secondary) / 0.7)',
          background: open ? 'oklch(var(--primary-500) / 0.08)' : 'transparent',
          border: `1px solid ${open ? 'oklch(var(--primary-500) / 0.35)' : 'oklch(var(--background-300) / 0.6)'}`,
        }}
        title={`Theme: ${currentMeta.label} — Click to switch`}
      >
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ background: currentMeta.previewColor }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-52 rounded-lg overflow-hidden z-50"
          style={{
            background: 'oklch(var(--background-100))',
            border: '1px solid oklch(var(--background-300) / 0.7)',
          }}
        >
          <div
            className="px-3 py-2 text-xs font-bold sd-eyebrow"
            style={{ borderBottom: '1px solid oklch(var(--background-300) / 0.5)' }}
          >
            Interface Theme
          </div>

          {THEME_META.map((meta) => {
            const isActive = theme === meta.id;
            return (
              <button
                key={meta.id}
                onClick={() => {
                  setTheme(meta.id);
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 cursor-pointer transition-all hover:bg-white/5 text-left"
                style={{
                  background: isActive ? 'oklch(var(--primary-500) / 0.06)' : 'transparent',
                  borderLeft: isActive ? '3px solid oklch(var(--primary-500))' : '3px solid transparent',
                }}
              >
                {/* Color preview circle */}
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: meta.previewColor }}
                >
                  {isActive && (
                    <i className="ri-check-line text-white text-xs"></i>
                  )}
                </div>

                {/* Label + description */}
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-xs font-semibold whitespace-nowrap"
                    style={{
                      color: isActive
                        ? 'oklch(var(--sd-text-primary))'
                        : 'oklch(var(--sd-text-secondary))',
                    }}
                  >
                    {meta.label}
                  </span>
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{
                      color: 'oklch(var(--sd-text-secondary) / 0.6)',
                      fontSize: 10,
                    }}
                  >
                    {meta.description}
                  </span>
                </div>

                {/* Theme icon */}
                <i
                  className={`${meta.icon} text-sm flex-shrink-0 ml-auto`}
                  style={{
                    color: isActive
                      ? 'oklch(var(--sd-text-highlight))'
                      : 'oklch(var(--sd-text-secondary) / 0.4)',
                  }}
                ></i>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}