import { releaseTag } from './version';

const REPOSITORY_API_URL = 'https://api.github.com/repos/nukeop/nuclear';

const fetchJson = async (path: string) =>
  (await fetch(`${REPOSITORY_API_URL}${path}`)).json();

const { stargazers_count } = await fetchJson('');
const { published_at } = await fetchJson(
  `/releases/tags/${encodeURIComponent(releaseTag)}`,
);

export const stars: string | null = stargazers_count
  ? `${(stargazers_count / 1000).toFixed(1)}k`
  : null;

export const releaseDate: string | null = published_at ?? null;
