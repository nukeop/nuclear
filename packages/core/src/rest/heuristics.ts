import { mean, sortBy } from 'lodash';
import levenshtein from 'fast-levenshtein';
import { Video } from '@distube/ytsr';

type ScoreTrackArgs<Track> = {
  track: Track;
  artist: string;
  title: string;
  duration?: number;
}

type OrderTracksArgs<Track> = {
  tracks: Track[];
  artist: string;
  title: string;
  duration?: number;
};

interface SearchHeuristics<Track> {
  scoreTrack: (args: ScoreTrackArgs<Track>) => number;
  orderTracks: (args: OrderTracksArgs<Track>) => Track[];
}

const penalizedWords = [
  'remix',
  'full album',
  'album'
];

const promotedWords = [
  'hq',
  'high quality',
  'official'
];

export class YoutubeHeuristics implements SearchHeuristics<Partial<Video>> {
  static createTitle = ({
    artist,
    title
  }: { artist: string; title: string; }) => `${artist} - ${title}`.toLowerCase();

  scoreTrack = ({
    track,
    artist,
    title,
    duration
  }: ScoreTrackArgs<Partial<Video>>) => {
    const trackTitle = YoutubeHeuristics.createTitle({ artist, title });
    const lowercaseResultTitle = track.name.toLowerCase();

    const titleScore = (1 - (levenshtein.get(trackTitle, lowercaseResultTitle) / trackTitle.length)) * 25;

    const verbatimSubstringScore = lowercaseResultTitle.includes(title.toLowerCase()) ? 300 : 0;

    const durationDelta = Math.abs(Number.parseFloat(track.duration) - duration);
    const durationScore = track.duration && duration
      ? (1 - durationDelta / duration) * 800
      : 0;

    const promotedWordsScore = promotedWords.some(promotedWord => lowercaseResultTitle.includes(promotedWord)) ? 100 : 0;

    const penalizedWordsScore = penalizedWords.some(word => lowercaseResultTitle.includes(word)) ? 0 : 200;

    let liveVideoScore = 100;
    if (lowercaseResultTitle.includes('live') && !trackTitle.includes('live')) {
      liveVideoScore = 0;
    }

    const channelNameScore = track.author?.name.toLowerCase().includes(artist.toLowerCase()) ? 300 : 0;

    return mean([
      titleScore,
      verbatimSubstringScore,
      durationScore,
      promotedWordsScore,
      penalizedWordsScore,
      liveVideoScore,
      channelNameScore
    ]);
  };

  orderTracks = ({
    tracks,
    artist,
    title,
    duration
  }: OrderTracksArgs<Partial<Video>>) => {
    const scores = tracks.map(track => this.scoreTrack({
      track,
      artist,
      title,
      duration
    }));

    return sortBy(tracks, track => -(scores[tracks.indexOf(track)]));
  }
}
