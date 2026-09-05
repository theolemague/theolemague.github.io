import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Gate = () => {
  const { t } = useTranslation();

  const handleChoose = (version: string) => localStorage.setItem('version', version);

  return (
    <main className="flex min-h-dvh items-center justify-center gap-4">
      <Link
        to="/serious"
        onClick={() => handleChoose('serious')}
        className="rounded-tight border border-rule px-6 py-3 text-base text-ink transition-colors duration-200 active:scale-[0.98] [@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:text-primary">
        {t('gate.serious')}
      </Link>
      <Link
        to="/fun"
        onClick={() => handleChoose('fun')}
        className="rounded-tight border border-rule px-6 py-3 text-base text-ink transition-colors duration-200 active:scale-[0.98] [@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:text-primary">
        {t('gate.fun')}
      </Link>
    </main>
  );
};

export default Gate;
