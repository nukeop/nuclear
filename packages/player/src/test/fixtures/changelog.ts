import { Changelog } from '../../types/changelog';

export const TEST_CHANGELOG: Changelog = {
  entries: [
    {
      version: '1.12.0',
      date: '2026-03-01',
      changes: [
        {
          description: 'Support importing legacy format playlists',
          type: 'feature',
          contributor: 'nukeop',
          tags: [{ label: 'Playlists', color: 'cyan' }],
        },
        {
          description: 'Fixed audio stuttering on track transition',
          type: 'fix',
        },
        {
          description: 'Improved plugin loading performance',
          type: 'improvement',
          contributor: 'someDev',
        },
      ],
    },
    {
      version: '1.11.1',
      date: '2026-02-15',
      changes: [
        {
          description: 'Added new website with dark mode',
          type: 'feature',
          tags: [{ label: 'Website', color: 'purple' }],
        },
        {
          description: 'Updated documentation',
          type: 'docs',
        },
      ],
    },
  ],
};

export const SINGLE_VERSION_CHANGELOG: Changelog = {
  entries: [TEST_CHANGELOG.entries[0]],
};
