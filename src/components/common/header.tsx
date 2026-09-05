import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './lang-switcher';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isFun = location.pathname.includes('/fun');

  return (
    <header className="flex items-start justify-between py-8">
      <Link to="/" className="label text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-ink">
        ← {t('ui.back-to-gate')}
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to={isFun ? '/serious' : '/fun'}
          onClick={() => localStorage.setItem('version', isFun ? 'serious' : 'fun')}
          className="label text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-amber">
          {isFun ? t('ui.switch-to-serious') : t('ui.switch-to-fun')} →
        </Link>
        <LangSwitcher />
      </div>
    </header>
  );
};

export default Header;
