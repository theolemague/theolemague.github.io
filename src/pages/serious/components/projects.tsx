import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import GithubRepos from '@/components/serious/github-repos';
import { Entry } from '@/data/parse-content';
import { inView, rise, wipe } from '@/utils/motion';

interface ProjectsProps {
  entries: Entry[];
}

const Projects = ({ entries }: ProjectsProps) => {
  const { t } = useTranslation();

  return (
    <motion.section {...inView} id="projects" className="py-24">
      <div className="mb-12 flex items-center gap-6">
        <motion.span variants={rise} className="label text-primary">
          02
        </motion.span>
        <motion.h2 variants={rise} className="display text-3xl sm:text-4xl">
          {t('sections.projects')}
        </motion.h2>
        <motion.span variants={wipe} className="h-px flex-1 origin-left bg-rule" />
      </div>

      <motion.p variants={rise} className="label mb-6 text-faint">
        {t('projects.selected')}
      </motion.p>
      {entries.map(project => (
        <motion.article key={project.title} variants={rise} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[220px_1fr] md:gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-ink" style={{ fontStretch: '105%', letterSpacing: '-0.012em' }}>
              {project.title}
            </h3>
            <span className="label text-faint">{project.subtitle}</span>
          </div>
          <div>
            <p className="max-w-[62ch] text-[0.9375rem] text-muted">{project.description}</p>
            {project.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {project.tags.map(tag => (
                  <li key={tag} className="label text-faint">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {project.links.map(link => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="label link mt-5 inline-flex items-center gap-2 text-ink [@media(hover:hover)]:hover:text-primary">
                {link.text}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </motion.article>
      ))}

      <motion.div variants={rise} className="mt-20">
        <p className="label mb-2 text-faint">{t('projects.github')}</p>
        <p className="mb-6 text-[0.9375rem] text-muted">{t('projects.github-hint')}</p>
        <GithubRepos />
      </motion.div>
    </motion.section>
  );
};

export default Projects;
