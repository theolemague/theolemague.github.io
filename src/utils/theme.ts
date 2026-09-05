export type Theme = 'dark' | 'light';

export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export const setTheme = (theme: Theme) => {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    // the switcher is rendered more than once (top bar, mobile menu, gate), so the
    // instances follow the document rather than each other
    window.dispatchEvent(new Event('themechange'));
  };

  const startViewTransition = (document as Document & { startViewTransition?: (callback: () => void) => void }).startViewTransition;

  if (startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startViewTransition.call(document, apply);
    return;
  }
  apply();
};
