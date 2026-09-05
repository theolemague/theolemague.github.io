import CONTENT from '@/data/content';

export interface ParcoursEntry {
  type: 'education' | 'experience';
  title: string;
  subtitle: string;
  city: string;
  start: string;
  end: string;
  details: string[];
  places: string[];
  period: string;
}

// ## Education and ## Experience normalised into one shape, newest first — the two
// tracks read as a single path rather than two lists
export const buildParcours = (lang: 'fr' | 'en', presentLabel: string): ParcoursEntry[] => {
  const { sections, places } = CONTENT[lang];

  const fromSection = (key: string, type: ParcoursEntry['type']) =>
    sections[key].entries.map(entry => ({
      type,
      title: entry.title,
      subtitle: entry.subtitle,
      city: entry.places.map(id => places.find(place => place.id === id)!.name).join(' & '),
      start: entry.start,
      end: entry.end,
      details: entry.details,
      places: entry.places,
      period: `${entry.start.slice(0, 4)} — ${entry.end ? entry.end.slice(0, 4) : presentLabel}`,
    }));

  return [...fromSection('education', 'education'), ...fromSection('experience', 'experience')].sort((a, b) => b.start.localeCompare(a.start));
};

// place ids ordered by the date each was first reached — the map and the flight
// both number the journey from this, so the two versions can never disagree
export const buildJourney = (parcours: ParcoursEntry[]): string[] => {
  const journey: string[] = [];

  for (const entry of [...parcours].reverse()) {
    for (const place of entry.places) {
      if (!journey.includes(place)) journey.push(place);
    }
  }

  return journey;
};
