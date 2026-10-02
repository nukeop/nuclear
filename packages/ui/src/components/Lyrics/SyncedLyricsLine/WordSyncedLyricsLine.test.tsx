import { render } from '@testing-library/react';

import { WordSyncedLyricsLine } from '.';

const LINE = {
  startMs: 1000,
  endMs: 4000,
  segments: [
    { text: 'Lorem ', startMs: 1000, endMs: 1500 },
    { text: 'ipsum ', startMs: 1500, endMs: 2000 },
    { text: 'dolor', startMs: 2000, endMs: 3000 },
  ],
};

describe('WordSyncedLyricsLine', () => {
  it('(Snapshot) renders a line that has already played', () => {
    const { container } = render(
      <WordSyncedLyricsLine line={LINE} positionMs={5000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a line halfway through its second word', () => {
    const { container } = render(
      <WordSyncedLyricsLine line={LINE} positionMs={1750} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a line that has not played yet', () => {
    const { container } = render(
      <WordSyncedLyricsLine line={LINE} positionMs={0} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders ruby, background vocals, and annotations', () => {
    const { container } = render(
      <WordSyncedLyricsLine
        positionMs={1750}
        line={{
          startMs: 1000,
          endMs: 4000,
          segments: [
            { text: '夜', ruby: 'よる', startMs: 1000, endMs: 1500 },
            { text: 'に', startMs: 1500, endMs: 2000 },
            { text: '駆', ruby: 'か', startMs: 2000, endMs: 2500 },
            { text: 'ける', startMs: 2500, endMs: 3000 },
          ],
          background: [{ text: 'Lorem ipsum', startMs: 3000, endMs: 4000 }],
          annotations: [
            {
              type: 'romanization',
              language: 'ja-Latn',
              text: 'Yoru ni kakeru',
            },
            {
              type: 'translation',
              language: 'en',
              text: 'Racing into the night',
            },
          ],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
