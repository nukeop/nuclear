const categoryColors = {
  releases: 'bg-primary',
  features: 'bg-accent-green',
  craft: 'bg-accent-blue',
} as const;

const FALLBACK_CATEGORY_COLOR = 'bg-background-secondary';

export type Category = keyof typeof categoryColors;

export const categories = Object.keys(categoryColors) as Category[];

export const tagColor = (tag: string): string =>
  categoryColors[tag as Category] ?? FALLBACK_CATEGORY_COLOR;
