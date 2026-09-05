import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getTheme, setTheme, Theme } from '@/utils/theme';

const THEMES: Theme[] = ['dark', 'light'];

const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const [theme, setCurrentTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    const handleThemeChange = () => setCurrentTheme(getTheme());
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  return (
    <div className="label flex items-center gap-1 text-faint">
      {THEMES.map((item, index) => (
        <span key={item} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            onClick={() => setTheme(item)}
            aria-current={theme === item}
            className={`label px-1 py-2 transition-colors duration-200 [@media(hover:hover)]:hover:text-ink ${theme === item ? 'text-primary' : ''}`}>
            {t(`ui.${item}`)}
          </button>
        </span>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
