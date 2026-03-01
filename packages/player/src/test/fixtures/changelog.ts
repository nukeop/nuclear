import type { ChangelogEntry } from '../../types/changelog';

export const TEST_CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-03-01T22:00',
    description: 'Support importing legacy format playlists',
    type: 'feature',
    contributors: ['nukeop'],
    tags: [{ label: 'Playlists', color: 'cyan' }],
  },
  {
    date: '2026-03-01T18:00',
    description: 'Fixed audio stuttering on track transition',
    type: 'fix',
  },
  {
    date: '2026-02-25T16:00',
    description: 'Improved plugin loading performance',
    type: 'improvement',
    contributors: ['someDev', 'nukeop'],
  },
  {
    date: '2026-02-20T14:00',
    description: 'MCP server for controlling Nuclear from AI agents',
    type: 'feature',
    tags: [{ label: 'MCP', color: 'green' }],
  },
  {
    date: '2026-02-20T12:00',
    description: 'Updated documentation',
    type: 'docs',
  },
];
