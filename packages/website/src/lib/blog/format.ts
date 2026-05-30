const WORDS_PER_MINUTE = 200;

export const readingTime = (body: string | undefined): number => {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const profileUrl = (author: string): string =>
  `https://github.com/${author}`;
