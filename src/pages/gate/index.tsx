import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LangSwitcher from '@/components/lang-switcher';

const enter = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const Gate = () => {
  const { t } = useTranslation();

  const handleChoose = (version: string) => localStorage.setItem('version', version);

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-dvh flex-col px-6 pt-8 pb-6 md:px-12 md:pt-10">
      <motion.header variants={enter} className="flex items-start justify-between">
        <div className="label text-faint leading-relaxed">
          <div className="text-ink">Théo Le Magueresse</div>
          <div>Portfolio — V2</div>
        </div>
        <LangSwitcher />
      </motion.header>

      <div className="flex flex-1 flex-col justify-center py-16 md:py-24">
        <motion.p variants={enter} className="label text-amber mb-6">
          {t('gate.intro')}
        </motion.p>
        <motion.h1 variants={enter} className="display max-w-[16ch] text-[2.5rem] sm:text-6xl lg:text-7xl">
          {t('gate.question')}
        </motion.h1>
      </div>

      <motion.div variants={enter} className="gate-panels grid border-t border-rule md:grid-cols-2">
        <Link
          to="/serious"
          onClick={() => handleChoose('serious')}
          className="group relative flex flex-col gap-5 py-10 transition-colors duration-300 md:border-r md:border-rule md:pr-12 [@media(hover:hover)]:hover:bg-white/2">
          <span className="label text-amber">01</span>
          <span className="display block h-[2.05em] text-3xl transition-[font-stretch] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl [font-stretch:100%] [@media(hover:hover)]:group-hover:[font-stretch:115%]">
            {t('gate.serious')}
          </span>
          <span className="max-w-[42ch] text-[0.9375rem] text-muted">{t('gate.serious-hint')}</span>
          <span className="label mt-auto flex items-center gap-3 pt-4 text-ink">
            {t('gate.enter')}
            <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-2">
              →
            </span>
          </span>
        </Link>

        <Link
          to="/fun"
          onClick={() => handleChoose('fun')}
          className="group relative flex flex-col gap-5 border-t border-rule py-10 transition-colors duration-300 md:border-t-0 md:pl-12 [@media(hover:hover)]:hover:bg-white/2">
          <span className="label text-amber">02</span>
          <span className="display block h-[2.05em] text-3xl transition-[font-stretch] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl [font-stretch:100%] [@media(hover:hover)]:group-hover:[font-stretch:115%]">
            {t('gate.fun')}
          </span>
          <span className="max-w-[42ch] text-[0.9375rem] text-muted">{t('gate.fun-hint')}</span>
          <span className="label mt-auto flex items-center gap-3 pt-4 text-ink">
            {t('gate.enter')}
            <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-2">
              →
            </span>
          </span>
        </Link>
      </motion.div>

      <motion.p variants={enter} className="label mt-6 text-faint">
        {t('gate.footer')}
      </motion.p>
    </motion.main>
  );
};

export default Gate;
