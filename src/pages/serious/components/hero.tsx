import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Content } from '@/data/parse-content';
import { container, rise } from '@/utils/motion';

interface HeroProps {
  content: Content;
}

const Hero = ({ content }: HeroProps) => {
  const { t } = useTranslation();

  return (
    // a full screen of its own: nothing of the next section shows until you scroll
    <motion.section variants={container} initial="hidden" animate="show" id="intro" className="flex min-h-dvh flex-col justify-center py-24">
      <motion.p variants={rise} className="label mb-6 text-primary">
        {t('hero.greeting')}
      </motion.p>
      <motion.h1 variants={rise} className="display mb-6 text-[2.75rem] sm:text-6xl lg:text-7xl">
        {content.name}
      </motion.h1>
      <motion.p variants={rise} className="mb-10 text-xl text-muted sm:text-2xl" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
        {content.role}
      </motion.p>
      <motion.p variants={rise} className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
        {content.intro}
      </motion.p>
      <motion.div variants={rise} className="mt-12">
        <a href="#parcours" className="label link group inline-flex items-center gap-3 text-ink [@media(hover:hover)]:hover:text-primary">
          {t('hero.cta')}
          <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-y-1">
            ↓
          </span>
        </a>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
