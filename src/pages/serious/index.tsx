import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CONTENT from '@/data/content';
import { buildJourney, buildParcours } from '@/data/parcours';
import GithubRepos from '../../components/serious/github-repos';
import ParcoursMap from '../../components/serious/parcours-map';
import NavBar from '../../components/serious/nav-bar';

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const Serious = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const content = CONTENT[lang];
  const parcours = buildParcours(lang, t('ui.present'));
  const journey = buildJourney(parcours);

  return (
    <>
      <NavBar />

      <main className="mx-auto min-h-0 max-w-7xl flex-1 scroll-smooth overflow-y-auto">
        <div className="md:mx-20">
          <section id="intro" className="flex min-h-full flex-col justify-center py-24">
            <motion.p {...reveal} className="label mb-6 text-primary">
              {t('hero.greeting')}
            </motion.p>
            <motion.h1 {...reveal} className="display mb-6 text-[2.75rem] sm:text-6xl lg:text-7xl">
              {content.name}
            </motion.h1>
            <motion.p {...reveal} className="mb-10 text-xl text-muted sm:text-2xl" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
              {content.role}
            </motion.p>
            <motion.p {...reveal} className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
              {content.intro}
            </motion.p>
            <motion.a {...reveal} href="#parcours" className="label mt-12 flex items-center gap-3 text-ink transition-colors duration-300 [@media(hover:hover)]:hover:text-primary">
              {t('hero.cta')}
              <span aria-hidden="true">↓</span>
            </motion.a>
          </section>

          <motion.section {...reveal} id="parcours" className="py-24">
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="label text-primary">01</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.parcours')}</h2>
              <span className="hidden h-px flex-1 bg-rule sm:block" />
              <div className="flex items-center gap-1">
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
              </div>
            </div>

            {viewMode === 'map' ? (
              <ParcoursMap entries={parcours} journey={journey} lang={lang} />
            ) : (
              parcours.map(item => (
                <article key={`${item.type}-${item.start}-${item.title}`} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[140px_1fr] md:gap-8">
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
                </article>
              ))
            )}
          </motion.section>

          <motion.section {...reveal} id="projects" className="py-24">
            <div className="mb-12 flex items-center gap-6">
              <span className="label text-primary">02</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.projects')}</h2>
              <span className="h-px flex-1 bg-rule" />
            </div>

            <p className="label mb-6 text-faint">{t('projects.selected')}</p>
            {content.sections.projects.entries.map(project => (
              <article key={project.title} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[220px_1fr] md:gap-8">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg text-ink" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
                    {project.title}
                  </h3>
                  <span className="label text-faint">{project.subtitle}</span>
                </div>
                <div>
                  <p className="max-w-[62ch] text-[0.9375rem] text-muted">{project.description}</p>
                  {project.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {project.tags.map(tag => (
                        <li key={tag} className="label text-faint">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  {project.links.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="label mt-4 inline-flex items-center gap-2 text-ink transition-colors duration-300 [@media(hover:hover)]:hover:text-primary">
                      {link.text}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </article>
            ))}

            <div className="mt-20">
              <p className="label mb-2 text-faint">{t('projects.github')}</p>
              <p className="mb-6 text-[0.9375rem] text-muted">{t('projects.github-hint')}</p>
              <GithubRepos />
            </div>
          </motion.section>

          <motion.section {...reveal} id="contact" className="py-24">
            <div className="mb-12 flex items-center gap-6">
              <span className="label text-primary">03</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.contact')}</h2>
              <span className="h-px flex-1 bg-rule" />
            </div>

            <p className="mb-10 max-w-[52ch] text-lg text-muted">{content.sections.contact.text}</p>
            <ul>
              {content.sections.contact.links.map(contact => (
                <li key={contact.url}>
                  <a
                    href={contact.url}
                    target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group grid gap-1 border-t border-rule py-6 transition-colors duration-300 md:grid-cols-[150px_1fr] md:gap-8 [@media(hover:hover)]:hover:bg-white/2">
                    <span className="label text-faint">{contact.label}</span>
                    <span className="flex items-center gap-3 text-[1.0625rem] text-ink transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">
                      {contact.text}
                      <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>

          <footer className="label border-t border-rule py-8 text-faint">© {new Date().getFullYear()} Théo Le Magueresse</footer>
        </div>
      </main>
    </>
  );
};

export default Serious;
