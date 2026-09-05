import { motion } from 'framer-motion';
import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CONTENT from '@/data/content';
import MAP from '@/data/europe-map.json';

export interface ParcoursEntry {
  type: 'education' | 'experience';
  title: string;
  subtitle: string;
  period: string;
  places: string[];
}

interface ParcoursMapProps {
  entries: ParcoursEntry[];
  journey: string[];
  lang: 'fr' | 'en';
}

const ParcoursMap = ({ entries, journey, lang }: ParcoursMapProps) => {
  const { t } = useTranslation();
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSelectedPlace(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const positions = Object.fromEntries(MAP.places.map(place => [place.id, place]));
  const route = journey.map(placeId => `${positions[placeId].x},${positions[placeId].y}`).join(' ');

  const selectedDetails = CONTENT[lang].places.find(place => place.id === selectedPlace);
  const selectedEntries = entries.filter(entry => selectedPlace && entry.places.includes(selectedPlace));
  const anchor = selectedPlace ? positions[selectedPlace] : null;

  // the card opens on the free side of its point, so it never sits on top of the route
  const cardOnRight = anchor && anchor.x < MAP.width * 0.5;
  const cardBelow = anchor && anchor.y < MAP.height * 0.5;

  return (
    <div>
      {/* the card is positioned against the map alone, so the caption below must sit outside this box */}
      <div className="relative">
        <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="h-auto w-full" role="img" aria-label={t('parcours.map-label')}>
          <g fill="none" stroke="var(--color-rule)" strokeWidth={0.9} strokeLinejoin="round">
            {MAP.countries.map(country => (
              <path key={country.name} d={country.d} />
            ))}
          </g>

          {/* the path actually walked, in order of arrival */}
          <polyline points={route} fill="none" stroke="var(--color-primary-dim)" strokeWidth={1.2} strokeDasharray="4 5" opacity={0.55} />

          {MAP.places.map(place => {
            const details = CONTENT[lang].places.find(item => item.id === place.id)!;
            const order = journey.indexOf(place.id) + 1;
            const isSelected = selectedPlace === place.id;
            const isLit = isSelected || hoveredPlace === place.id;
            const isDimmed = selectedPlace !== null && !isLit;
            const labelOnRight = place.x < MAP.width * 0.72;

            return (
              <g
                key={place.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${order} — ${details.name}`}
                onMouseEnter={() => setHoveredPlace(place.id)}
                onMouseLeave={() => setHoveredPlace(null)}
                onFocus={() => setHoveredPlace(place.id)}
                onBlur={() => setHoveredPlace(null)}
                onClick={() => setSelectedPlace(isSelected ? null : place.id)}
                onKeyDown={event => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  setSelectedPlace(isSelected ? null : place.id);
                }}
                className="cursor-pointer transition-opacity duration-300 focus:outline-none focus-visible:outline-solid"
                opacity={isDimmed ? 0.35 : 1}>
                <circle cx={place.x} cy={place.y} r={22} fill="transparent" />
                <circle
                  cx={place.x}
                  cy={place.y}
                  r={isLit ? 18 : 12}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth={1}
                  opacity={isLit ? 0.45 : 0}
                  className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <circle
                  cx={place.x}
                  cy={place.y}
                  r={isLit ? 12.5 : 11}
                  fill={isLit ? 'var(--color-primary)' : 'var(--color-canvas)'}
                  stroke="var(--color-primary)"
                  strokeWidth={1.2}
                  className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <text
                  x={place.x}
                  y={place.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isLit ? 'var(--color-canvas)' : 'var(--color-primary)'}
                  className="pointer-events-none transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500 }}>
                  {order}
                </text>
                <text
                  x={labelOnRight ? place.x + 20 : place.x - 20}
                  y={place.y + 4}
                  textAnchor={labelOnRight ? 'start' : 'end'}
                  fill={isLit ? 'var(--color-ink)' : 'var(--color-faint)'}
                  className="pointer-events-none transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {details.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* readout — pinned beside its own point at desktop widths, stacked under the map on mobile */}
        {selectedDetails && anchor && (
          <motion.div
            key={selectedPlace}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ '--card-x': `${(anchor.x / MAP.width) * 100}%`, '--card-y': `${(anchor.y / MAP.height) * 100}%` } as CSSProperties}
            className={`relative mt-6 border border-rule bg-canvas/95 p-5 md:absolute md:mt-0 md:top-[var(--card-y)] md:left-[var(--card-x)] md:w-[19rem] ${cardOnRight ? 'md:translate-x-6' : 'md:translate-x-[calc(-100%_-_1.5rem)]'} ${cardBelow ? 'md:translate-y-5' : 'md:translate-y-[calc(-100%_-_1.25rem)]'}`}>
            <button
              type="button"
              onClick={() => setSelectedPlace(null)}
              aria-label={t('parcours.close')}
              className="absolute top-3 right-3 p-1 text-lg leading-none text-faint transition-colors duration-200 [@media(hover:hover)]:hover:text-primary">
              <span aria-hidden="true">×</span>
            </button>

            <p className="label pr-8 text-primary">
              {String(journey.indexOf(selectedDetails.id) + 1).padStart(2, '0')} · {selectedDetails.name} — {selectedDetails.country}
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {selectedEntries.map(entry => (
                <div key={entry.title}>
                  <p className="label text-faint">
                    {entry.period} · {t(`parcours.${entry.type}`)}
                  </p>
                  <p className="mt-1 text-[0.9375rem] text-ink">{entry.title}</p>
                  <p className="text-[0.8125rem] text-muted">{entry.subtitle}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <p className="label mt-6 text-faint">{t('parcours.hint')}</p>
    </div>
  );
};

export default ParcoursMap;
