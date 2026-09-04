import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import MAP from '@/data/europe-map.json';
import RESUME from '@/data/resume.json';

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

  const activePlace = hoveredPlace ?? selectedPlace;
  const activeDetails = RESUME.places.find(place => place.id === activePlace);
  const activeEntries = entries.filter(entry => activePlace && entry.places.includes(activePlace));

  const positions = Object.fromEntries(MAP.places.map(place => [place.id, place]));
  const route = journey.map(placeId => `${positions[placeId].x},${positions[placeId].y}`).join(' ');

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="h-auto w-full" role="img" aria-label={t('parcours.map-label')}>
        <g fill="none" stroke="var(--color-rule)" strokeWidth={0.9} strokeLinejoin="round">
          {MAP.countries.map(country => (
            <path key={country.name} d={country.d} />
          ))}
        </g>

        {/* the path actually walked, in order of arrival */}
        <polyline points={route} fill="none" stroke="var(--color-amber-dim)" strokeWidth={1.2} strokeDasharray="4 5" opacity={0.55} />

        {MAP.places.map(place => {
          const details = RESUME.places.find(item => item.id === place.id)!;
          const isActive = activePlace === place.id;
          const isDimmed = activePlace !== null && !isActive;
          const labelOnRight = place.x < MAP.width * 0.72;

          return (
            <g
              key={place.id}
              role="button"
              tabIndex={0}
              aria-pressed={selectedPlace === place.id}
              aria-label={details.name}
              onMouseEnter={() => setHoveredPlace(place.id)}
              onMouseLeave={() => setHoveredPlace(null)}
              onFocus={() => setHoveredPlace(place.id)}
              onBlur={() => setHoveredPlace(null)}
              onClick={() => setSelectedPlace(selectedPlace === place.id ? null : place.id)}
              onKeyDown={event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                setSelectedPlace(selectedPlace === place.id ? null : place.id);
              }}
              className="cursor-pointer transition-opacity duration-300"
              opacity={isDimmed ? 0.3 : 1}>
              <circle cx={place.x} cy={place.y} r={16} fill="transparent" />
              <circle
                cx={place.x}
                cy={place.y}
                r={isActive ? 13 : 0}
                fill="none"
                stroke="var(--color-amber)"
                strokeWidth={1}
                opacity={0.45}
                className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <circle cx={place.x} cy={place.y} r={isActive ? 6.5 : 5} fill="var(--color-amber)" className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <text
                x={labelOnRight ? place.x + 15 : place.x - 15}
                y={place.y + 4}
                textAnchor={labelOnRight ? 'start' : 'end'}
                fill={isActive ? 'var(--color-ink)' : 'var(--color-faint)'}
                className="pointer-events-none transition-colors duration-300"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {details.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* readout — overlaid on open water at desktop widths, stacked below on mobile */}
      <div className="mt-6 min-h-[9rem] border border-rule bg-canvas/95 p-5 md:absolute md:top-6 md:left-6 md:mt-0 md:min-h-[13rem] md:w-[19rem]">
        {activeDetails ? (
          <>
            <p className="label text-amber">
              {activeDetails.name} — {activeDetails.country[lang]}
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {activeEntries.map(entry => (
                <div key={entry.title}>
                  <p className="label text-faint">
                    {entry.period} · {t(`parcours.${entry.type}`)}
                  </p>
                  <p className="mt-1 text-[0.9375rem] text-ink">{entry.title}</p>
                  <p className="text-[0.8125rem] text-muted">{entry.subtitle}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="label text-faint">{t('parcours.hint')}</p>
        )}
      </div>
    </div>
  );
};

export default ParcoursMap;
