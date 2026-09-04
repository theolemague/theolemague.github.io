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
  'Kosovo', 'Macedonia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus', 'Ukraine', 'Moldova',
];

const WIDTH = 900;
const HEIGHT = 860;
// The frame: Europe from Gibraltar up to Scandinavia, enough context around the pins.
// The southern edge sits below Tarifa and Sicily so that Iberia and Italy come out whole
// instead of being dropped by the rule below — which is what sets the 900×860 proportion.
// A MultiPoint, not a Polygon — d3 treats polygon edges as geodesics, which
// makes fitSize badly misjudge the bounds of a lon/lat rectangle.
const FRAME = {
  type: 'MultiPoint',
  coordinates: [
    [-12, 35.5],
    [30, 35.5],
    [30, 61],
    [-12, 61],
  ],
};

const land = feature(world, world.objects.countries);
const european = land.features.filter(item => COUNTRIES.includes(item.properties.name));

const projection = geoMercator().fitSize([WIDTH, HEIGHT], FRAME);
const toPath = geoPath(projection);

// Drawn whatever the frame does to them: the countries the parcours happens in, plus
// Norway — Sweden reads as an island without it.
const ALWAYS_DRAWN = [...resume.places.map(place => place.country.en), 'Norway'];

// A country is drawn whole or not at all — a shape sliced by the frame edge reads as a
// mistake. Territories that fall entirely outside the frame (French Guiana, Svalbard) are
// dropped first, since they are off-canvas anyway and would otherwise disqualify a country.
const countries = european
  .map(item => {
    const polygons = item.geometry.type === 'Polygon' ? [item.geometry.coordinates] : item.geometry.coordinates;
    const drawn = polygons.filter(coordinates => {
      const [[x0, y0], [x1, y1]] = toPath.bounds({ type: 'Polygon', coordinates });
      return x1 > 0 && y1 > 0 && x0 < WIDTH && y0 < HEIGHT;
    });
    return { name: item.properties.name, geometry: { type: 'MultiPolygon', coordinates: drawn } };
  })
  .filter(item => {
    if (item.geometry.coordinates.length === 0) return false;
    if (ALWAYS_DRAWN.includes(item.name)) return true;
    const [[x0, y0], [x1, y1]] = toPath.bounds(item.geometry);
    return x0 >= 0 && y0 >= 0 && x1 <= WIDTH && y1 <= HEIGHT;
  })
  .map(item => ({ name: item.name, d: toPath(item.geometry) }));

const places = resume.places.map(place => {
  const [x, y] = projection([place.lon, place.lat]);
  return { id: place.id, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
});

writeFileSync('src/data/europe-map.json', JSON.stringify({ width: WIDTH, height: HEIGHT, countries, places }, null, 2) + '\n');

console.log(`${countries.length} countries, ${places.length} places`);
places.forEach(place => console.log(`  ${place.id.padEnd(11)} x=${place.x} y=${place.y}`));
