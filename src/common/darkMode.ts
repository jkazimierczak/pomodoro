const LS_THEME = "theme";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

export function setTheme(theme: Theme) {
  switch (theme) {
    case Theme.DARK:
      localStorage.setItem(LS_THEME, Theme.DARK);
      document.documentElement.classList.add(Theme.DARK);
      break;
    case Theme.LIGHT:
      localStorage.setItem(LS_THEME, Theme.LIGHT);
      document.documentElement.classList.remove(Theme.DARK);
      break;
  }
}

function isDarkModePreferred() {
  return !(LS_THEME in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function isDarkMode() {
  return localStorage.getItem(LS_THEME) === Theme.DARK || isDarkModePreferred();
}

export function toggleTheme() {
  if (isDarkMode()) {
    setTheme(Theme.LIGHT);
  } else {
    setTheme(Theme.DARK);
  }
}
