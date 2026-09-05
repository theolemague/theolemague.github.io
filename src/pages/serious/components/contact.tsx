import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Section } from '@/data/parse-content';
import { inView, rise, wipe } from '@/utils/motion';

interface ContactProps {
  section: Section;
}

const Contact = ({ section }: ContactProps) => {
  const { t } = useTranslation();

  return (
    <motion.section {...inView} id="contact" className="py-24">
      <div className="mb-12 flex items-center gap-6">
        <motion.span variants={rise} className="label text-primary">
          03
        </motion.span>
        <motion.h2 variants={rise} className="display text-3xl sm:text-4xl">
          {t('sections.contact')}
        </motion.h2>
        <motion.span variants={wipe} className="h-px flex-1 origin-left bg-rule" />
      </div>

      <motion.p variants={rise} className="mb-10 max-w-[52ch] text-lg text-muted">
        {section.text}
      </motion.p>
      <ul>
        {section.links.map(contact => (
          <motion.li key={contact.url} variants={rise}>
            <a
              href={contact.url}
              target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="group grid gap-1 border-t border-rule py-6 transition-colors duration-300 md:grid-cols-[150px_1fr] md:gap-8 [@media(hover:hover)]:hover:bg-ink/4">
              <span className="label text-faint">{contact.label}</span>
              <span className="flex items-center gap-3 text-[1.0625rem] text-ink transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">
                {contact.text}
                <span aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-2">
                  →
                </span>
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
};

export default Contact;
