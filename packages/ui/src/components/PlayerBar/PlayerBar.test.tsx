import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { PlayerBar } from './PlayerBar';

describe('PlayerBar', () => {
  it('(Snapshot) default render', () => {
    const { asFragment } = render(
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Song Title"
            artist="Artist Name"
            coverUrl="https://picsum.photos/48"
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={75} />}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) active states render', () => {
    const { asFragment } = render(
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Crystalized"
            artist="XX"
            coverUrl="https://picsum.photos/48"
          />
        }
        center={
          <PlayerBar.Controls isPlaying isShuffleActive repeatMode="all" />
        }
        right={<PlayerBar.Volume defaultValue={60} />}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) long metadata truncation', () => {
    const longTitle =
      'An Incredibly, Ridiculously Long Song Title That Should Truncate Nicely';
    const longArtist =
      'A Very Long Artist Name Featuring Another Long Artist With Even More Characters';
    const { asFragment } = render(
      <div style={{ width: 420 }}>
        <PlayerBar
          left={
            <PlayerBar.NowPlaying
              title={longTitle}
              artist={longArtist}
              coverUrl="https://picsum.photos/48"
            />
          }
          center={<PlayerBar.Controls />}
          right={<PlayerBar.Volume defaultValue={50} />}
        />
      </div>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) no artwork fallback', () => {
    const { asFragment } = render(
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Untitled Track"
            artist="Unknown Artist"
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={30} />}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
