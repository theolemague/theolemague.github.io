import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CONTENT from '@/data/content';
import LangSwitcher from '@/components/ui/lang-switcher';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import { container, rise } from '@/utils/motion';

const VERSIONS = [
  { id: 'serious', to: '/serious', index: '01' },
  { id: 'fun', to: '/fun', index: '02' },
];

const Gate = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  const content = CONTENT[lang];

  const handleChoose = (version: string) => localStorage.setItem('version', version);

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="flex min-h-dvh flex-col justify-between gap-16 py-8">
      <motion.div variants={rise} className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div>
          <p className="display text-lg">{content.name}</p>
          <p className="label mt-2 text-faint">{content.role}</p>
        </div>
        <div className="flex items-center gap-5">
          <LangSwitcher />
          <span aria-hidden="true" className="h-3 w-px bg-rule" />
          <ThemeSwitcher />
        </div>
      </motion.div>

      {/* two panels, split by a hairline — vertical from md, horizontal below */}
      <div className="grid flex-1 divide-y divide-rule border-t border-rule md:grid-cols-2 md:divide-x md:divide-y-0">
        {VERSIONS.map((version, index) => (
          <motion.div key={version.id} variants={rise}>
            <Link
              to={version.to}
              onClick={() => handleChoose(version.id)}
              className={`group flex h-full flex-col justify-end gap-5 py-12 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.99] md:px-10 ${index === 0 ? 'md:pl-0' : 'md:pr-0'} [@media(hover:hover)]:hover:bg-ink/4`}>
              <span className="label text-primary">{version.index}</span>
              <h2 className="display text-4xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-5xl [@media(hover:hover)]:group-hover:translate-x-2">
                {t(`gate.${version.id}`)}
              </h2>
              <p className="max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted">{t(`gate.${version.id}-hint`)}</p>
              <span className="label flex items-center gap-3 text-faint transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">
                {t('gate.enter')}
                <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-2">
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
};

export default Gate;
