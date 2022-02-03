import { sortBy } from 'lodash';
import { Video } from 'ytsr';
import levenshtein from 'fast-levenshtein';

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

export class YoutubeHeuristics implements SearchHeuristics<Partial<Video>> {
  static createTitle = ({
    artist, 
    title
  }: { artist: string; title: string; }) => `${artist} - ${title}`;

  scoreTrack = ({
    track,
    artist,
    title,
    duration
  }: ScoreTrackArgs<Partial<Video>>) => {
    const titleScore = levenshtein.get(YoutubeHeuristics.createTitle({ artist, title }), track.title);
    return titleScore;
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
    return sortBy(tracks, track => scores[tracks.indexOf(track)]);
  }
}
