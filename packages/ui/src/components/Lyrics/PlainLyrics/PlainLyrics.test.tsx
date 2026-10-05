import { render, screen } from '@testing-library/react';

import { PlainLyrics } from '.';

describe('PlainLyrics', () => {
  it('(Snapshot) renders sections with and without labels', () => {
    const { container } = render(
      <PlainLyrics
        sections={[
          {
            label: 'Verse 1',
            lines: [
              { segments: [{ text: 'Lorem ipsum dolor sit amet' }] },
              { segments: [{ text: 'Consectetur ' }, { text: 'adipiscing' }] },
            ],
          },
          {
            lines: [{ segments: [{ text: 'Sed do eiusmod tempor' }] }],
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders ruby, background vocals, and annotations', () => {
    const { container } = render(
      <PlainLyrics
        sections={[
          {
            lines: [
              {
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
              },
            ],
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('shows the section label and the names of the vocalists who sing in the section', () => {
    render(
      <PlainLyrics
        vocalists={[
          { id: 'first', name: 'Lorem', type: 'person' },
          { id: 'second', name: 'Ipsum', type: 'person' },
          { id: 'third', name: 'Dolor', type: 'person' },
        ]}
        sections={[
          {
            label: 'Chorus',
            lines: [
              { segments: [{ text: 'Sit amet' }], vocalistIds: ['second'] },
              {
                segments: [{ text: 'Consectetur' }],
                vocalistIds: ['first', 'second'],
              },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('Chorus - Ipsum - Lorem')).toBeInTheDocument();
  });
});
