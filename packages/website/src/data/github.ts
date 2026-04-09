const response = await fetch('https://api.github.com/repos/nukeop/nuclear');
const { stargazers_count } = await response.json();

export const stars: string | null = stargazers_count
  ? `${(stargazers_count / 1000).toFixed(1)}k`
  : null;
