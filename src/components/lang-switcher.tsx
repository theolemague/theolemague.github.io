import { useTranslation } from 'react-i18next';

const LANGUAGES = ['fr', 'en'];

const LangSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="label flex items-center gap-1 text-faint">
      {LANGUAGES.map((language, index) => (
        <span key={language} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            onClick={() => handleChange(language)}
            aria-current={i18n.language === language}
            className={`label px-1 py-2 transition-colors duration-200 [@media(hover:hover)]:hover:text-ink ${i18n.language === language ? 'text-amber' : ''}`}>
            {language.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LangSwitcher;
