import { describe, expect, it } from 'vitest';

import { buildReleaseElement, prependRelease } from './metainfo-releases.mjs';

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
