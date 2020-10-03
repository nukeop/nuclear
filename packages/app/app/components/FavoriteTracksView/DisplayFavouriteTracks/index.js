import React from 'react';
import PropTypes from 'prop-types';
import { TrackRow } from '@nuclear/ui';

export const SORT_TYPE = {
  NONE: 'none',
  ARTIST: 'artist',
  TITLE: 'title'
};

const DisplayFavouriteTracks = ({
  tracks,
  removeFavoriteTrack,
  sortOrder
}) => {
    
  const sortTrackAscending = (a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  };
  
  const sortArtist = (list, isAscending = true) => {
    const output = [...list].sort((a, b) => sortTrackAscending(a.artist.name, b.artist.name));
    return isAscending ? output : output.reverse();
  };
  
  const sortTitle = (list, isAscending = true) => {
    const output = [...list].sort((a, b) => sortTrackAscending(a.name, b.name));
    return isAscending ? output : output.reverse();
  };
  
  
  switch (sortOrder.current) {
  case SORT_TYPE.ARTIST:
    tracks = sortArtist(tracks, sortOrder.isAscending);
    break;
  case SORT_TYPE.TITLE:
    tracks = sortTitle(tracks, sortOrder.isAscending);
    break;
  default:
    break;
  }
  
  return (
    tracks.map((track, i) => {
  
      return (
        <TrackRow
          key={'favorite-track-' + i}
          track={track}
          index={i}
          displayCover
          displayArtist
          withDeleteButton
          withAddToFavorites={false}
          onDelete={e => {
            e.stopPropagation();
            removeFavoriteTrack(track);
          }}
        />
      );
    })
  );
  
  
};
  
DisplayFavouriteTracks.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string,
    duration: PropTypes.number
  
  })),
  removeFavoriteTrack: PropTypes.func,
  sortOrder: PropTypes.shape({
    current: PropTypes.string,
    isAscending: PropTypes.bool
  })
};
  
DisplayFavouriteTracks.defaultProps = {
  tracks: [],
  removeFavoriteTrack: () => {},
  sortOrder: SORT_TYPE.NONE
};

export default DisplayFavouriteTracks;
