import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CONTENT from '@/data/content';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
}

const GithubRepos = () => {
  const { t } = useTranslation();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // the username comes from the GitHub line under ## Contact, so the repository
  // list follows the markdown like everything else
  const githubLink = CONTENT.en.sections.contact.links.find(link => link.url.includes('github.com/'));
  const githubUser = githubLink ? githubLink.url.split('github.com/')[1] : '';

  useEffect(() => {
    // one request, not one per repo — the previous version fetched each README
    // and language list separately and exhausted the unauthenticated rate limit
    const loadRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('github request failed');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('unexpected github response');
        setRepos(data.filter(repo => !repo.fork).slice(0, 6));
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    };
    loadRepos();
  }, [githubUser]);

  if (status === 'loading') return <p className="label text-faint">{t('projects.loading')}</p>;

  if (status === 'error' || repos.length === 0) return <p className="label text-faint">{t('projects.error')}</p>;

  return (
    <ul>
      {repos.map(repo => (
        <li key={repo.id}>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group grid gap-1 border-t border-rule py-5 transition-colors duration-300 md:grid-cols-[220px_1fr] md:gap-8 [@media(hover:hover)]:hover:bg-white/2">
            <span className="flex items-baseline gap-3">
              <span className="text-[0.9375rem] text-ink transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">{repo.name}</span>
              <span aria-hidden="true" className="text-faint transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:translate-x-1">
                ↗
              </span>
            </span>
            <span className="flex flex-col gap-1">
              {repo.description && <span className="text-[0.9375rem] text-muted">{repo.description}</span>}
              {repo.language && <span className="label text-faint">{repo.language}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default GithubRepos;
