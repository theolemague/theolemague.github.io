import { AnimatePresence, motion } from 'framer-motion';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CONTENT from '@/data/content';
import { ParcoursEntry } from '@/data/parcours';
import { Telemetry, Waypoint } from '../../utils/world-system';

interface ReadoutsProps {
  telemetry: RefObject<Telemetry>;
  unlocked: Waypoint[];
}

// the instrument block: speed, and which world is nearest with a needle pointing
// at it. Written straight to the DOM because these change sixty times a second
// and none of it belongs in React state.
const Readouts = ({ telemetry, unlocked }: ReadoutsProps) => {
  const { t } = useTranslation();
  const speedRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const warningRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let frame = requestAnimationFrame(function tick() {
      const { speed, targetId, targetDistance, targetBearing, outOfRange } = telemetry.current;
      const target = unlocked.find(waypoint => waypoint.id === targetId);

      if (speedRef.current) speedRef.current.textContent = String(Math.round(speed)).padStart(2, '0');
      if (needleRef.current) needleRef.current.style.transform = `rotate(${targetBearing}rad)`;
      if (targetRef.current) targetRef.current.textContent = target ? target.label : '—';
      if (distanceRef.current) distanceRef.current.textContent = String(Math.round(targetDistance)).padStart(3, '0');
      if (warningRef.current) warningRef.current.hidden = !outOfRange;

      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [telemetry, unlocked]);

  return (
    <div className="flex flex-col gap-2">
      <p ref={warningRef} hidden className="label text-primary">
        {t('fun.out-of-range')}
      </p>
      <div className="flex items-center gap-6 border-t border-rule pt-3">
        <span className="label flex items-baseline gap-2 text-faint">
          {t('fun.speed')}
          <span ref={speedRef} className="text-ink">
            00
          </span>
        </span>
        <span className="label flex items-baseline gap-2 text-faint">
          {t('fun.target')}
          {/* the needle turns with the bearing, so the nearest world is never lost */}
          <span ref={needleRef} aria-hidden="true" className="inline-block text-primary">
            ↑
          </span>
          <span ref={targetRef} className="text-ink" />
          <span ref={distanceRef} className="text-faint" />
        </span>
      </div>
    </div>
  );
};

interface DossierProps {
  docked: Waypoint;
  parcours: ParcoursEntry[];
  lang: 'fr' | 'en';
}

const Dossier = ({ docked, parcours, lang }: DossierProps) => {
  const { t } = useTranslation();

  const content = CONTENT[lang];
  const place = content.places.find(item => item.id === docked.id);
  const entries = parcours.filter(entry => entry.places.includes(docked.id));

  return (
    <motion.aside
      key={docked.id}
      aria-live="polite"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto fixed right-0 bottom-16 left-0 z-40 max-h-[45dvh] overflow-y-auto border-t border-rule bg-canvas/92 p-5 backdrop-blur-sm md:top-28 md:bottom-8 md:left-auto md:max-h-none md:w-[23rem] md:border-t-0 md:border-l md:p-6">
      <p className="label text-primary">
        {String(docked.order).padStart(2, '0')} · {docked.label}
        {place && ` — ${place.country}`}
      </p>

      {docked.kind === 'intro' && (
        <div className="mt-5">
          <p className="label text-faint">{t('hero.greeting')}</p>
          <p className="mt-3 text-xl text-ink" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
            {content.name}
          </p>
          <p className="mt-1 text-[0.9375rem] text-muted">{content.role}</p>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">{content.intro}</p>
        </div>
      )}

      {docked.kind === 'place' && (
        <div className="mt-5 flex flex-col gap-5">
          {entries.map(entry => (
            <div key={entry.title}>
              <p className="label text-faint">
                {entry.period} · {t(`parcours.${entry.type}`)}
              </p>
              <p className="mt-1 text-[0.9375rem] text-ink">{entry.title}</p>
              <p className="text-[0.8125rem] text-muted">{entry.subtitle}</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {entry.details.map(detail => (
                  <li key={detail} className="flex gap-2.5 text-[0.8125rem] text-muted">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 bg-primary" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {docked.kind === 'projects' && (
        <div className="mt-5 flex flex-col gap-5">
          {content.sections.projects.entries.map(project => (
            <div key={project.title}>
              <p className="label text-faint">{project.subtitle}</p>
              <p className="mt-1 text-[0.9375rem] text-ink">{project.title}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">{project.description}</p>
              {project.links.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="label mt-2 inline-flex items-center gap-2 text-ink transition-colors duration-300 [@media(hover:hover)]:hover:text-primary">
                  {link.text}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}

      {docked.kind === 'contact' && (
        <div className="mt-5">
          <p className="text-[0.9375rem] text-muted">{content.sections.contact.text}</p>
          <ul className="mt-4">
            {content.sections.contact.links.map(contact => (
              <li key={contact.url}>
                <a
                  href={contact.url}
                  target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-rule py-3 transition-colors duration-300">
                  <span className="label text-faint">{contact.label}</span>
                  <span className="text-[0.875rem] text-ink transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">{contact.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="label mt-6 border-t border-rule pt-3 text-faint">{t('fun.undock')}</p>
    </motion.aside>
  );
};

interface HudProps {
  telemetry: RefObject<Telemetry>;
  unlocked: Waypoint[];
  justUnlocked: Waypoint | null;
  docked: Waypoint | null;
  parcours: ParcoursEntry[];
  lang: 'fr' | 'en';
  hasFlown: boolean;
}

const Hud = ({ telemetry, unlocked, justUnlocked, docked, parcours, lang, hasFlown }: HudProps) => {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState<Waypoint | null>(null);

  // a world often unlocks behind you, where its own animation cannot be seen, so
  // the HUD says so too and then gets out of the way
  useEffect(() => {
    if (!justUnlocked) return;
    setAnnouncement(justUnlocked);
    const timer = setTimeout(() => setAnnouncement(null), 3500);
    return () => clearTimeout(timer);
  }, [justUnlocked]);

  return (
    <>
      {/* the overlay itself never takes the pointer, so a drag anywhere still flies */}
      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-end px-6 pt-20 pb-24 md:px-12 md:pb-8">
        <footer className="flex items-end justify-between gap-6">
          <Readouts telemetry={telemetry} unlocked={unlocked} />
          <AnimatePresence>
            {!hasFlown && (
              <motion.p exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="label hidden max-w-[16rem] text-right text-muted md:block">
                {t('fun.hint')}
              </motion.p>
            )}
          </AnimatePresence>
        </footer>
      </div>

      <AnimatePresence>
        {announcement && (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed inset-x-0 top-28 z-40 flex justify-center px-6">
            <p className="label border-b border-primary pb-2 text-center text-primary">
              {t('fun.unlocked')} · {String(announcement.order).padStart(2, '0')} {announcement.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">{docked && <Dossier docked={docked} parcours={parcours} lang={lang} />}</AnimatePresence>
    </>
  );
};

export default Hud;
