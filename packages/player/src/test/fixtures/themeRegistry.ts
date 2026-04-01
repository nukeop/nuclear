export const THEME_REGISTRY_THEMES = [
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Cherry blossom',
    author: 'nukeop',
    tags: ['pink', 'warm'],
    palette: [
      'oklch(0.8 0.12 350)',
      'oklch(0.3 0.05 300)',
      'oklch(0.95 0.02 350)',
      'oklch(0.6 0.15 330)',
    ],
    path: 'themes/sakura.json',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    description: 'Cool blue Scandinavian theme',
    author: 'someone',
    tags: ['blue', 'cool'],
    palette: [
      'oklch(0.7 0.1 230)',
      'oklch(0.25 0.05 230)',
      'oklch(0.9 0.02 230)',
      'oklch(0.5 0.12 230)',
    ],
    path: 'themes/nordic-frost.json',
  },
];

export const THEME_REGISTRY_RESPONSE = {
  version: 1,
  themes: THEME_REGISTRY_THEMES,
};

export const SAKURA_THEME_FILE = {
  version: 1,
  name: 'Sakura',
  author: 'nukeop',
  description: 'Cherry blossom',
  tags: ['pink', 'warm'],
  palette: [
    'oklch(0.8 0.12 350)',
    'oklch(0.3 0.05 300)',
    'oklch(0.95 0.02 350)',
    'oklch(0.6 0.15 330)',
  ],
  vars: {
    background: 'oklch(0.95 0.02 350)',
    primary: 'oklch(0.8 0.12 350)',
  },
  dark: {
    background: 'oklch(0.15 0.03 330)',
    primary: 'oklch(0.7 0.15 350)',
  },
};
