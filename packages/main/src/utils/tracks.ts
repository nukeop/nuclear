import { TrackType } from '@nuclear/core';
import _ from 'lodash';

export const getTrackTitle = (track: TrackType) => track?.name || track?.title;

export const getTrackArtists = (track: TrackType) => track?.artists;
