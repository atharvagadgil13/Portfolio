(() => {
  'use strict';
  const key = 'atharva-portfolio-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => value === 'light' || value === 'dark';
  let preference = null;
  try {
    const stored = localStorage.getItem(key);
    if (valid(stored)) preference = stored;
  } catch { /* The toggle still works when browser storage is unavailable. */ }
  function apply() {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#131e19' : '#173e32';
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const dark = theme === 'dark';
      const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      toggle.querySelector('.theme-label').textContent = dark ? 'Light' : 'Dark';
    }
  }
  // Apply before the stylesheet loads to prevent a flash of the wrong theme.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Session-only choice. */ }
      apply();
    });
  });
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue) ? event.newValue : null;
      apply();
    }
  });
})();
