import { ParcoursEntry } from '@/data/parcours';
import RESUME from '@/data/resume.json';

export interface Waypoint {
  id: string;
  kind: 'intro' | 'place' | 'projects' | 'contact';
  label: string;
  order: number;
  position: [number, number, number];
  radius: number;
  dockRadius: number;
}

// DESIGN.md tokens, resolved to sRGB hex — three cannot read the oklch custom properties
export const COLORS = {
  canvas: '#0f0d0b',
  surface: '#1b1815',
  ink: '#efeae6',
  muted: '#9c9793',
  faint: '#847f7b',
  rule: '#312d2a',
  amber: '#ff9d36',
  amberDim: '#a86a2c',
};

// nothing marks the route any more, so the worlds are scattered rather than
// arranged: you find them by flying and by watching the needle, not by reading a
// line off the screen.
const SPREAD = 42;
const JITTER = 24;

// deterministic on purpose. buildSystem runs on every render, so a Math.random()
// here would teleport the planets each time the dossier opened.
const noise = (index: number, salt: number) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

// the golden angle throws each world in a different direction instead of along a
// path, and the jitter keeps the spiral underneath from ever becoming readable
const positionAt = (index: number): [number, number, number] => {
  const angle = index * 2.39996 + noise(index, 1) * 1.4;
  const distance = SPREAD * Math.sqrt(index) + noise(index, 2) * JITTER;
  return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
};

export const FLIGHT_BOUNDS = 190;

export const buildSystem = (parcours: ParcoursEntry[], journey: string[], labels: { intro: string; projects: string; contact: string }): Waypoint[] => {
  const places = journey.map((placeId, index) => {
    const details = RESUME.places.find(place => place.id === placeId)!;
    // a place you stayed twice is a bigger world than one you passed through once
    const radius = 2.6 + parcours.filter(entry => entry.places.includes(placeId)).length * 0.6;

    return {
      id: placeId,
      kind: 'place' as const,
      label: details.name,
      order: index + 1,
      position: positionAt(index + 1),
      radius,
      dockRadius: radius + 7,
    };
  });

  // the presentation is 00 and sits at the centre of the system: the start of the
  // search rather than a stop on it, and the point the out-of-range tow aims for. It
  // also leaves the cities numbered exactly as the map on the serious version numbers them
  return [
    { id: 'intro', kind: 'intro' as const, label: labels.intro, order: 0, position: [0, 0, 0], radius: 5, dockRadius: 12 },
    ...places,
    { id: 'projects', kind: 'projects' as const, label: labels.projects, order: places.length + 1, position: positionAt(places.length + 1), radius: 4.4, dockRadius: 11.4 },
    { id: 'contact', kind: 'contact' as const, label: labels.contact, order: places.length + 2, position: positionAt(places.length + 2), radius: 3.6, dockRadius: 10.6 },
  ];
};

// written by the ship every frame and read by the HUD on its own animation frame —
// piloting readouts change too fast to run through React state
export interface Telemetry {
  speed: number;
  targetId: string | null;
  targetDistance: number;
  // clockwise-positive, measured from straight ahead: the HUD needle rotates by
  // this directly, so it is stored in screen terms rather than world terms
  targetBearing: number;
  outOfRange: boolean;
}
