import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ParcoursMap from '@/components/serious/parcours-map';
import { ParcoursEntry } from '@/data/parcours';
import { container, inView, rise, wipe } from '@/utils/motion';

interface ParcoursProps {
  entries: ParcoursEntry[];
  journey: string[];
  lang: 'fr' | 'en';
}

const Parcours = ({ entries, journey, lang }: ParcoursProps) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  return (
    <motion.section {...inView} id="parcours" className="py-24">
      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <motion.span variants={rise} className="label text-primary">
          01
        </motion.span>
        <motion.h2 variants={rise} className="display text-3xl sm:text-4xl">
          {t('sections.parcours')}
        </motion.h2>
        <motion.span variants={wipe} className="hidden h-px flex-1 origin-left bg-rule sm:block" />
        <motion.div variants={rise} className="flex items-center gap-1">
          {(['map', 'list'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              aria-pressed={viewMode === mode}
              className={`label px-3 py-2 transition-colors duration-200 ${viewMode === mode ? 'text-primary' : 'text-faint [@media(hover:hover)]:hover:text-ink'}`}>
              {t(`parcours.view-${mode}`)}
            </button>
          ))}
        </motion.div>
      </div>

      {/* its own reveal, keyed on the view. The section fired once and will not
          orchestrate children that mount later, so a toggled block that leant on it
          stayed at opacity 0 — and the collapsed section took the page width with it.
          No margin here: you are looking at the block when you switch it. */}
      <motion.div key={viewMode} variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {viewMode === 'map' ? (
          <motion.div variants={rise}>
            <ParcoursMap entries={entries} journey={journey} lang={lang} />
          </motion.div>
        ) : (
          entries.map(item => (
            <motion.article key={`${item.type}-${item.start}-${item.title}`} variants={rise} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[140px_1fr] md:gap-8">
              <div className="flex flex-col gap-1">
                <span className="label text-faint">{item.period}</span>
                <span className="label text-primary-dim">{t(`parcours.${item.type}`)}</span>
              </div>
              <div>
                <h3 className="text-xl text-ink" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.9375rem] text-muted">
                  {item.subtitle} · {item.city}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {item.details.map(detail => (
                    <li key={detail} className="flex gap-3 text-[0.9375rem] text-muted">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))
        )}
      </motion.div>
    </motion.section>
  );
};

export default Parcours;
