export type ThemePreference = "light" | "dark" | "default";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "default") {
      return value;
    }
  } catch {
    // ignore storage errors
  }
  return "default";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "default" ? getSystemTheme() : preference;
}

export function applyResolvedTheme(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute("data-pc-theme", resolved);
}

export function applyThemePreference(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  applyResolvedTheme(resolved);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // ignore storage errors
  }
  return resolved;
}
