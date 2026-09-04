import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LangSwitcher from '@/components/lang-switcher';
import RESUME from '@/data/resume.json';
import GithubRepos from './components/github-repos';
import ParcoursMap from './components/parcours-map';
import NavBar from './components/nav-bar';

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const formatRange = (start: string, end: string) => `${new Date(start).getFullYear()} — ${end === '/' ? t('ui.present') : new Date(end).getFullYear()}`;

  // education and work normalised into one shape, newest first — this is the
  // "parcours": the two tracks read as a single path rather than two lists
  const parcours = [
    ...RESUME.educations.map(item => ({
      type: 'education' as const,
      title: item.name[lang],
      subtitle: item.university[lang],
      city: item.city[lang],
      start: item.start,
      end: item.end,
      details: [item.description[lang]],
      places: item.places,
      period: formatRange(item.start, item.end),
    })),
    ...RESUME.works.map(item => ({
      type: 'experience' as const,
      title: item.name[lang],
      subtitle: item.company[lang],
      city: item.city[lang],
      start: item.start,
      end: item.end,
      details: item.tasks.map(task => task[lang]),
      places: item.places,
      period: formatRange(item.start, item.end),
    })),
  ].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const journey = RESUME.places
    .map(place => ({
      id: place.id,
      arrival: Math.min(...parcours.filter(item => item.places.includes(place.id)).map(item => new Date(item.start).getTime())),
    }))
    .sort((a, b) => a.arrival - b.arrival)
    .map(place => place.id);

  const contacts = [
    { label: t('contact.email'), value: RESUME.profile.email, href: `mailto:${RESUME.profile.email}` },
    { label: t('contact.linkedin'), value: RESUME.profile.linkedin, href: RESUME.profile.linkedin },
    { label: t('contact.github'), value: RESUME.profile.githubUser, href: RESUME.profile.github },
  ].filter(contact => contact.value);

  return (
    <div className="mx-auto max-w-[1000px] px-6 md:px-10">
      <header className="flex items-start justify-between py-8">
        <Link to="/" className="label text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-ink">
          ← {t('ui.back-to-gate')}
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/fun" onClick={() => localStorage.setItem('version', 'fun')} className="label text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-amber">
            {t('ui.switch-to-fun')} →
          </Link>
          <LangSwitcher />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[44px_1fr] lg:gap-14">
        <nav className="sticky top-0 z-10 -mx-6 border-b border-rule bg-canvas px-6 md:-mx-10 md:px-10 lg:mx-0 lg:flex lg:h-dvh lg:items-center lg:border-b-0 lg:px-0">
          <NavBar />
        </nav>

        <main className="pb-32">
          <section id="intro" className="flex min-h-dvh flex-col justify-center py-24">
            <motion.p {...reveal} className="label mb-6 text-amber">
              {t('hero.greeting')}
            </motion.p>
            <motion.h1 {...reveal} className="display mb-6 text-[2.75rem] sm:text-6xl lg:text-7xl">
              {t('hero.name')}
            </motion.h1>
            <motion.p {...reveal} className="mb-10 text-xl text-muted sm:text-2xl" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
              {t('hero.role')}
            </motion.p>
            <motion.p {...reveal} className="max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
              {t('hero.intro')}
            </motion.p>
            <motion.a {...reveal} href="#parcours" className="label mt-12 flex items-center gap-3 text-ink transition-colors duration-300 [@media(hover:hover)]:hover:text-amber">
              {t('hero.cta')}
              <span aria-hidden="true">↓</span>
            </motion.a>
          </section>

          <motion.section {...reveal} id="parcours" className="py-24">
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="label text-amber">01</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.parcours')}</h2>
              <span className="hidden h-px flex-1 bg-rule sm:block" />
              <div className="flex items-center gap-1">
                {(['map', 'list'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    className={`label px-3 py-2 transition-colors duration-200 ${viewMode === mode ? 'text-amber' : 'text-faint [@media(hover:hover)]:hover:text-ink'}`}>
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
                    <span className="label text-amber-dim">{t(`parcours.${item.type}`)}</span>
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
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-amber" />
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
              <span className="label text-amber">02</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.projects')}</h2>
              <span className="h-px flex-1 bg-rule" />
            </div>

            <p className="label mb-6 text-faint">{t('projects.selected')}</p>
            {RESUME.projects.map(project => (
              <article key={project.name} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[220px_1fr] md:gap-8">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg text-ink" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
                    {project.name}
                  </h3>
                  <span className="label text-faint">{project.context[lang]}</span>
                </div>
                <div>
                  <p className="max-w-[62ch] text-[0.9375rem] text-muted">{project.description[lang]}</p>
                  {project.stack.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {project.stack.map(item => (
                        <li key={item} className="label text-faint">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="label mt-4 inline-flex items-center gap-2 text-ink transition-colors duration-300 [@media(hover:hover)]:hover:text-amber">
                      {t('projects.view')}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
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
              <span className="label text-amber">03</span>
              <h2 className="display text-3xl sm:text-4xl">{t('sections.contact')}</h2>
              <span className="h-px flex-1 bg-rule" />
            </div>

            <p className="mb-10 max-w-[52ch] text-lg text-muted">{t('contact.text')}</p>
            <ul>
              {contacts.map(contact => (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group grid gap-1 border-t border-rule py-6 transition-colors duration-300 md:grid-cols-[150px_1fr] md:gap-8 [@media(hover:hover)]:hover:bg-white/2">
                    <span className="label text-faint">{contact.label}</span>
                    <span className="flex items-center gap-3 text-[1.0625rem] text-ink transition-colors duration-300 [@media(hover:hover)]:group-hover:text-amber">
                      {contact.value}
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
        </main>
      </div>
    </div>
  );
};

export default Home;
