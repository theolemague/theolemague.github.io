// Generates src/data/europe-map.json from world-atlas at build time, so the
// browser ships a plain SVG path list instead of d3-geo and a TopoJSON file.
// Run with: bun run build:map

import { writeFileSync } from 'fs';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json' with { type: 'json' };

import resume from '../src/data/resume.json' with { type: 'json' };

const COUNTRIES = [
  'France', 'Spain', 'Portugal', 'Italy', 'Switzerland', 'Austria', 'Germany', 'Belgium', 'Netherlands', 'Luxembourg',
  'United Kingdom', 'Ireland', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Poland', 'Czechia', 'Slovakia', 'Hungary',
  'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Romania', 'Bulgaria', 'Greece', 'Albania', 'Montenegro',
  'Kosovo', 'North Macedonia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Ukraine', 'Moldova',
];

const WIDTH = 900;
const HEIGHT = 640;
// The frame: western Europe up to Scandinavia, enough context around the pins.
// A MultiPoint, not a Polygon — d3 treats polygon edges as geodesics, which
// makes fitSize badly misjudge the bounds of a lon/lat rectangle.
const FRAME = {
  type: 'MultiPoint',
  coordinates: [
    [-12, 43],
    [30, 43],
    [30, 61],
    [-12, 61],
  ],
};

const land = feature(world, world.objects.countries);
const european = land.features.filter(item => COUNTRIES.includes(item.properties.name));

const projection = geoMercator().fitSize([WIDTH, HEIGHT], FRAME);
const toPath = geoPath(projection);

const countries = european.map(item => ({ name: item.properties.name, d: toPath(item) })).filter(item => item.d);

const places = resume.places.map(place => {
  const [x, y] = projection([place.lon, place.lat]);
  return { id: place.id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
});

writeFileSync('src/data/europe-map.json', JSON.stringify({ width: WIDTH, height: HEIGHT, countries, places }, null, 2) + '\n');

console.log(`${countries.length} countries, ${places.length} places`);
places.forEach(place => console.log(`  ${place.id.padEnd(11)} x=${place.x} y=${place.y}`));
