import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LangSwitcher from './lang-switcher';
import ThemeSwitcher from './theme-switcher';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isFun = location.pathname.includes('/fun');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSwitch = () => {
    localStorage.setItem('version', isFun ? 'serious' : 'fun');
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* md and up: a fading bar at the top. pointer-events pass through it so a
          drag across the top of the fun version still flies the ship */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-20 items-center justify-between bg-linear-to-b from-canvas via-canvas/80 to-transparent px-6 md:flex md:px-12">
        <Link to="/" className="label pointer-events-auto text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-ink">
          ← {t('ui.back-to-gate')}
        </Link>
        <div className="pointer-events-auto flex items-center gap-6">
          <Link to={isFun ? '/serious' : '/fun'} onClick={handleSwitch} className="label text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-primary">
            {isFun ? t('ui.switch-to-serious') : t('ui.switch-to-fun')} →
          </Link>
          <LangSwitcher />
          {/* the flight is a night instrument view — no theme choice while in it */}
          {!isFun && (
            <>
              <span aria-hidden="true" className="h-3 w-px bg-rule" />
              <ThemeSwitcher />
            </>
          )}
        </div>
      </header>

      {/* below md the bar is solid and sits at the bottom, leaving the top of the
          screen to the section nav */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-end border-t border-rule bg-canvas px-6 md:hidden">
        <button type="button" onClick={() => setIsMenuOpen(true)} className="label flex items-center gap-3 py-2 text-ink">
          <span aria-hidden="true">☰</span>
          {t('ui.menu')}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-canvas px-6 pb-6 md:hidden">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="label border-t border-rule py-5 text-faint">
              ← {t('ui.back-to-gate')}
            </Link>
            <Link to={isFun ? '/serious' : '/fun'} onClick={handleSwitch} className="label border-t border-rule py-5 text-ink">
              {isFun ? t('ui.switch-to-serious') : t('ui.switch-to-fun')} →
            </Link>
            <div className="flex items-center justify-between border-t border-rule pt-4">
              <div className="flex items-center gap-5">
                <LangSwitcher />
                {!isFun && (
                  <>
                    <span aria-hidden="true" className="h-3 w-px bg-rule" />
                    <ThemeSwitcher />
                  </>
                )}
              </div>
              <button type="button" onClick={() => setIsMenuOpen(false)} aria-label={t('ui.close')} className="label px-2 py-2 text-faint">
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
