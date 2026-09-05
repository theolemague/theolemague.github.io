import en from '../../content/en.md?raw';
import fr from '../../content/fr.md?raw';
import { parseContent } from './parse-content';

// parsed once at load. The markdown is a few kilobytes, and reading it here means
// editing content/*.md is the whole workflow — no build step, no generated file
const CONTENT = { en: parseContent(en), fr: parseContent(fr) };

export default CONTENT;
