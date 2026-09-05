// The markdown in content/*.md, turned into the shapes the two versions of the
// site read. Kept free of imports so scripts/build-map.mjs can run it too.

export interface Place {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface Link {
  label: string;
  text: string;
  url: string;
}

export interface Entry {
  title: string;
  subtitle: string;
  start: string;
  end: string;
  places: string[];
  description: string;
  details: string[];
  tags: string[];
  links: Link[];
}

export interface Section {
  text: string;
  links: Link[];
  entries: Entry[];
}

export interface Content {
  name: string;
  role: string;
  intro: string;
  places: Place[];
  sections: Record<string, Section>;
}

const LINK = /^(?:\*\*(.+?)\*\*\s*)?\[(.+?)\]\((.+?)\)$/;

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

// the table under ## Places. The header and the dashes fall out on their own —
// neither has a number where the latitude belongs
const parsePlaces = (markdown: string): Place[] =>
  markdown
    .split('\n')
    .filter(line => line.trim().startsWith('|'))
    .map(line =>
      line
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim()),
    )
    .filter(cells => cells.length === 4 && Number.isFinite(Number(cells[2])))
    .map(([name, country, lat, lon]) => ({ id: slugify(name), name, country, lat: Number(lat), lon: Number(lon) }));

// the italic line under a title. Order is free: an arrow means dates, a known
// city means a place, and whatever is left is the subtitle
const applyMeta = (entry: Entry, text: string, places: Place[]) => {
  const subtitle: string[] = [];

  for (const part of text.split('·').map(item => item.trim())) {
    if (part.includes('→')) {
      const [start, end] = part.split('→').map(item => item.trim());
      entry.start = start;
      // anything that is not a date — now, aujourd'hui — means it is still going
      entry.end = /^\d/.test(end) ? end : '';
      continue;
    }

    const place = places.find(item => item.name.toLowerCase() === part.toLowerCase());
    if (place) {
      entry.places.push(place.id);
      continue;
    }

    subtitle.push(part);
  }

  entry.subtitle = subtitle.join(' · ');
};

export const parseContent = (markdown: string): Content => {
  const places = parsePlaces(markdown);
  const content: Content = { name: '', role: '', intro: '', places, sections: {} };

  let section: Section | null = null;
  let entry: Entry | null = null;

  for (const raw of markdown.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('|')) continue;

    if (line.startsWith('### ')) {
      entry = { title: line.slice(4).trim(), subtitle: '', start: '', end: '', places: [], description: '', details: [], tags: [], links: [] };
      if (section) section.entries.push(entry);
      continue;
    }

    if (line.startsWith('## ')) {
      section = { text: '', links: [], entries: [] };
      entry = null;
      content.sections[slugify(line.slice(3))] = section;
      continue;
    }

    if (line.startsWith('# ')) {
      content.name = line.slice(2).trim();
      continue;
    }

    // prettier rewrites *italic* to _italic_, so both mark the same line
    if (/^[*_][^*_].*[^*_][*_]$/.test(line)) {
      const text = line.slice(1, -1).trim();
      if (entry) applyMeta(entry, text, places);
      else content.role = text;
      continue;
    }

    if (line.startsWith('- ')) {
      const bullet = line.slice(2).trim();
      const link = bullet.match(LINK);
      if (link && section) (entry ?? section).links.push({ label: link[1] ?? '', text: link[2], url: link[3] });
      else if (entry) entry.details.push(bullet);
      continue;
    }

    if (entry && line.startsWith('`') && line.endsWith('`')) {
      entry.tags = [...line.matchAll(/`([^`]+)`/g)].map(match => match[1]);
      continue;
    }

    const link = line.match(LINK);
    if (link && section) {
      (entry ?? section).links.push({ label: link[1] ?? '', text: link[2], url: link[3] });
      continue;
    }

    // a plain paragraph, wrapped over as many lines as reads well in the file
    if (entry) entry.description = entry.description ? `${entry.description} ${line}` : line;
    else if (section) section.text = section.text ? `${section.text} ${line}` : line;
    else content.intro = content.intro ? `${content.intro} ${line}` : line;
  }

  return content;
};
