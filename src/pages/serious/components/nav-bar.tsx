import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SECTIONS = ['intro', 'parcours', 'projects', 'contact'];

const NavBar = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    // the band is the middle 10% of the viewport, so a section becomes active
    // as it crosses the centre rather than as it first appears
    const observer = new IntersectionObserver(entries => entries.filter(entry => entry.isIntersecting).forEach(entry => setActiveSection(entry.target.id)), {
      rootMargin: '-45% 0px -45% 0px',
    });

    SECTIONS.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ul className="flex gap-6 lg:flex-col lg:items-center lg:gap-10">
      {SECTIONS.map(section => (
        <li key={section}>
          <a
            href={`#${section}`}
            aria-current={activeSection === section}
            className={`label flex items-center gap-3 py-2 transition-colors duration-300 lg:flex-col ${activeSection === section ? 'text-ink' : 'text-faint [@media(hover:hover)]:hover:text-muted'}`}>
            {/* on the desktop rail the label reads bottom-to-top, so the nav is a
                hairline-wide column instead of a block of horizontal text */}
            <span className="lg:rotate-180 lg:[writing-mode:vertical-rl]">{t(`nav.${section}`)}</span>
            <span
              aria-hidden="true"
              className={`h-px w-3 origin-left bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-3 lg:w-px lg:origin-bottom ${activeSection === section ? 'scale-x-100 lg:scale-y-100' : 'scale-x-0 lg:scale-x-100 lg:scale-y-0'}`}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavBar;
