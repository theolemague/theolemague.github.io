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
    <nav className="-mx-6 md:fixed top-0 left-6 shrink-0 overflow-x-auto border-b border-rule px-6 md:-mx-10 md:px-10 md:mx-0 md:flex md:h-full md:items-center md:overflow-visible md:border-b-0 md:px-0">
      <ul className="flex w-max gap-6 md:w-auto md:flex-col md:items-center md:gap-10">
        {SECTIONS.map(section => (
          <li key={section}>
            <a
              href={`#${section}`}
              aria-current={activeSection === section}
              className={`label flex items-center gap-3 py-2 transition-colors duration-300 md:flex-col ${activeSection === section ? 'text-ink' : 'text-faint [@media(hover:hover)]:hover:text-muted'}`}>
              {/* on the desktop rail the label reads bottom-to-top, so the nav is a
                hairline-wide column instead of a block of horizontal text */}
              <span className="md:rotate-180 md:[writing-mode:vertical-rl]">{t(`nav.${section}`)}</span>
              <span
                aria-hidden="true"
                className={`h-px w-3 origin-left bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-3 md:w-px md:origin-bottom ${activeSection === section ? 'scale-x-100 md:scale-y-100' : 'scale-x-0 md:scale-x-100 md:scale-y-0'}`}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
