import { describe, expect, it } from 'vitest';

import {
  buildReleaseElement,
  generateReleasesBlock,
  getChangelogForRelease,
  injectReleases,
  PLACEHOLDER,
} from './sync-metainfo-releases.mjs';

const changelog = [
  {
    date: '2026-03-21T00:00',
    description: 'Flatpak from-source build',
    type: 'improvement',
  },
  {
    date: '2026-03-20T00:00',
    description: 'Fixed thumbnails in queue',
    type: 'fix',
  },
  {
    date: '2026-03-20T00:00',
    description: 'Plugin install prompts',
    type: 'improvement',
  },
  {
    date: '2026-03-18T00:00',
    description: 'AUR auto-update',
    type: 'improvement',
  },
  { date: '2026-03-16T00:00', description: 'Console window fix', type: 'fix' },
  {
    date: '2026-03-14T00:00',
    description: 'Auto yt-dlp download',
    type: 'improvement',
  },
  { date: '2026-03-12T00:00', description: 'Update badge', type: 'feature' },
  { date: '2026-03-09T00:00', description: 'Social links', type: 'feature' },
];

const tags = [
  { version: '1.24.0', date: '2026-03-22' },
  { version: '1.23.3', date: '2026-03-18' },
  { version: '1.23.0', date: '2026-03-16' },
  { version: '1.22.0', date: '2026-03-14' },
  { version: '1.20.0', date: '2026-03-12' },
  { version: '1.19.0', date: '2026-03-09' },
];

describe('getChangelogForRelease', () => {
  it('collects entries between this tag and the previous one', () => {
    expect(
      getChangelogForRelease(tags[0], tags[1], changelog),
    ).toMatchSnapshot();
  });

  it('collects all entries up to the tag date when there is no previous tag', () => {
    expect(
      getChangelogForRelease(tags[5], undefined, changelog),
    ).toMatchSnapshot();
  });
});

describe('buildReleaseElement', () => {
  it('builds a list when there are entries', () => {
    const entries = [
      { date: '2026-01-01T00:00', description: 'First change', type: 'fix' },
      {
        date: '2026-01-01T00:00',
        description: 'Second change',
        type: 'feature',
      },
    ];
    const xml = buildReleaseElement(
      { version: '1.5.0', date: '2026-01-01' },
      entries,
    );

    expect(xml).toMatchSnapshot();
  });

  it('builds a placeholder paragraph when there are no entries', () => {
    const xml = buildReleaseElement(
      { version: '1.5.0', date: '2026-01-01' },
      [],
    );

    expect(xml).toMatchSnapshot();
  });
});

describe('generateReleasesBlock', () => {
  it('includes only the 5 most recent tags', () => {
    const block = generateReleasesBlock(tags, changelog);

    expect(block).toMatchSnapshot();
  });

  it('assigns the right entries to the right releases', () => {
    const block = generateReleasesBlock(tags, changelog);

    const v1240Section = block.slice(
      block.indexOf('version="1.24.0"'),
      block.indexOf('version="1.23.3"'),
    );
    expect(v1240Section).toContain('Flatpak from-source build');
    expect(v1240Section).toContain('Fixed thumbnails in queue');
    expect(v1240Section).not.toContain('AUR auto-update');

    const v1233Section = block.slice(
      block.indexOf('version="1.23.3"'),
      block.indexOf('version="1.23.0"'),
    );
    expect(v1233Section).toContain('AUR auto-update');
    expect(v1233Section).not.toContain('Console window fix');
  });
});

describe('injectReleases', () => {
  it('replaces the placeholder with the releases block', () => {
    const metainfo = `<component>\n  ${PLACEHOLDER}\n</component>`;
    const result = injectReleases(metainfo, '<releases></releases>');

    expect(result).toBe('<component>\n  <releases></releases>\n</component>');
  });

  it('throws when the placeholder is missing', () => {
    expect(() =>
      injectReleases('<component></component>', '<releases/>'),
    ).toThrow('Placeholder');
  });
});
