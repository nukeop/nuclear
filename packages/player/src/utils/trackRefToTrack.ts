import type { Track, TrackRef } from '@nuclearplayer/model';

export const trackRefToTrack = (ref: TrackRef): Track => ({
  ...ref,
  artists: ref.artists.map((artist) => ({ ...artist, roles: [] })),
});
