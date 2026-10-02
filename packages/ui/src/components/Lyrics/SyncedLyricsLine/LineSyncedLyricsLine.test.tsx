import { render } from '@testing-library/react';

import { LineSyncedLyricsLine } from '.';

const LINE = {
  startMs: 1000,
  endMs: 4000,
  segments: [{ text: 'Lorem ipsum dolor sit amet' }],
};

describe('LineSyncedLyricsLine', () => {
  it('(Snapshot) renders a line that has already played', () => {
    const { container } = render(
      <LineSyncedLyricsLine line={LINE} positionMs={5000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a line halfway through', () => {
    const { container } = render(
      <LineSyncedLyricsLine line={LINE} positionMs={2500} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders a line that has not played yet', () => {
    const { container } = render(
      <LineSyncedLyricsLine line={LINE} positionMs={0} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders ruby, background vocals, and annotations', () => {
    const { container } = render(
      <LineSyncedLyricsLine
        positionMs={2500}
        line={{
          startMs: 1000,
          endMs: 4000,
          segments: [
            { text: '夜', ruby: 'よる' },
            { text: 'に' },
            { text: '駆', ruby: 'か' },
            { text: 'ける' },
          ],
          background: [{ text: 'Lorem ipsum' }],
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
