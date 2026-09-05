import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import NavBar from '@/components/serious/nav-bar';
import CONTENT from '@/data/content';
import { buildJourney, buildParcours } from '@/data/parcours';
import Contact from './components/contact';
import Hero from './components/hero';
import Parcours from './components/parcours';
import Projects from './components/projects';

const Serious = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  const content = CONTENT[lang];
  const parcours = buildParcours(lang, t('ui.present'));
  const journey = buildJourney(parcours);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col">
      <NavBar />

      {/* w-full is load-bearing: mx-auto on a flex item cancels its stretch, so without a
          definite width main is sized by fit-content and its width follows whichever view
          is showing — the map and the list do not measure the same */}
      <main className="mx-auto w-full min-h-0 max-w-7xl flex-1 scroll-smooth overflow-y-auto">
        <div className="md:mx-20">
          <Hero content={content} />
          <Parcours entries={parcours} journey={journey} lang={lang} />
          <Projects entries={content.sections.projects.entries} />
          <Contact section={content.sections.contact} />

          <footer className="label border-t border-rule py-8 text-faint">© {new Date().getFullYear()} Théo Le Magueresse</footer>
        </div>
      </main>
    </motion.div>
  );
};

export default Serious;
