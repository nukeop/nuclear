import { describe, expect, it } from 'vitest';

import {
  buildReleaseElement,
  getChangelogForRelease,
  prependRelease,
} from './metainfo-releases.mjs';

describe('getChangelogForRelease', () => {
  it('includes entries after the previous tag date up to the release date', () => {
    const changelog = [
      { date: '2026-03-21T00:00', description: 'in window: release day' },
      { date: '2026-03-19T00:00', description: 'in window: between tags' },
      { date: '2026-03-18T00:00', description: 'out: previous release day' },
      { date: '2026-03-10T00:00', description: 'out: older release' },
    ];

    const entries = getChangelogForRelease(
      { version: '1.24.0', date: '2026-03-21' },
      { version: '1.23.3', date: '2026-03-18' },
      changelog,
    );

    expect(entries.map((entry) => entry.description)).toEqual([
      'in window: release day',
      'in window: between tags',
    ]);
  });
});

describe('buildReleaseElement', () => {
  it('renders entries as list items with XML escaping', () => {
    const xml = buildReleaseElement({ version: '1.5.0', date: '2026-01-01' }, [
      { date: '2026-01-01T00:00', description: 'Support <Badge> & friends' },
    ]);

    expect(xml).toContain('<release version="1.5.0" date="2026-01-01">');
    expect(xml).toContain('<li>Support &lt;Badge&gt; &amp; friends</li>');
  });

  it('falls back to a plain paragraph when the window is empty', () => {
    const xml = buildReleaseElement(
      { version: '1.5.0', date: '2026-01-01' },
      [],
    );

    expect(xml).toContain('<p>Release 1.5.0.</p>');
  });
});

describe('prependRelease', () => {
  it('inserts the new release before existing ones', () => {
    const metainfo =
      '<component>\n  <releases>\n    <release version="1.4.0" date="2026-01-01"/>\n  </releases>\n</component>\n';

    const result = prependRelease(metainfo, '    <release version="1.5.0"/>');

    expect(result).toBe(
      '<component>\n  <releases>\n    <release version="1.5.0"/>\n    <release version="1.4.0" date="2026-01-01"/>\n  </releases>\n</component>\n',
    );
  });

  it('throws when the metainfo has no releases element', () => {
    expect(() => prependRelease('<component/>', '<release/>')).toThrow(
      'No <releases> element found in metainfo',
    );
  });
});
