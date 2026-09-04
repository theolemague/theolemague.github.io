import RESUME from '@/data/resume.json';

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

// education and work normalised into one shape, newest first — the two tracks
// read as a single path rather than two lists
export const buildParcours = (lang: 'fr' | 'en', presentLabel: string): ParcoursEntry[] => {
  const formatRange = (start: string, end: string) => `${new Date(start).getFullYear()} — ${end === '/' ? presentLabel : new Date(end).getFullYear()}`;

  const educations = RESUME.educations.map(item => ({
    type: 'education' as const,
    title: item.name[lang],
    subtitle: item.university[lang],
    city: item.city[lang],
    start: item.start,
    end: item.end,
    details: [item.description[lang]],
    places: item.places,
    period: formatRange(item.start, item.end),
  }));

  const works = RESUME.works.map(item => ({
    type: 'experience' as const,
    title: item.name[lang],
    subtitle: item.company[lang],
    city: item.city[lang],
    start: item.start,
    end: item.end,
    details: item.tasks.map(task => task[lang]),
    places: item.places,
    period: formatRange(item.start, item.end),
  }));

  return [...educations, ...works].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
};

// place ids ordered by the date each was first reached — the map and the flight
// both number the journey from this, so the two versions can never disagree
export const buildJourney = (parcours: ParcoursEntry[]): string[] =>
  RESUME.places
    .map(place => ({
      id: place.id,
      arrival: Math.min(...parcours.filter(entry => entry.places.includes(place.id)).map(entry => new Date(entry.start).getTime())),
    }))
    .sort((a, b) => a.arrival - b.arrival)
    .map(place => place.id);
