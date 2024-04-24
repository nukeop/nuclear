import React from 'react';
import _ from 'lodash';
import { Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import TrackRow from '../../TrackRow';
import trackRowStyles from '../../TrackRow/styles.scss';

type Artist = {
  name?: string;
}

type Track = {
  name?: string;
  image?: string;
  thumbnail?: string;
  artist: Artist | string;
}

type TracksResultsProps = {
  tracks?: Track[];
  limit: number;
}

type TrackRowProps = {
  track: Track;
  displayArtist?: boolean;
  displayCover?: boolean;
}

const TracksResults: React.FC<TracksResultsProps> = ({ tracks, limit }) => {
  const { t } = useTranslation('search');
  const collection = tracks || [];
  if (collection.length === 0) {
    return <>{t('empty')}</>;
  } else {
    return (
      <Segment className={trackRowStyles.tracks_container}>
        <table>
          <tbody>
            {_.take(collection, limit).map((track, index) => {
              if (
                track &&
                _.hasIn(track, 'name') &&
                (_.hasIn(track, 'image') || _.hasIn(track, 'thumbnail')) &&
                _.hasIn(track, 'artist')
              ) {
                const newTrack = _.cloneDeep(track);
                if (typeof newTrack.artist === 'string') {
                  newTrack.artist = { name: newTrack.artist };
                }
                const trackRowProps: TrackRowProps = {
                  track: newTrack,
                  displayArtist: true,
                  displayCover: true,
                };
                return (
                  <TrackRow
                    key={'search-result-track-row-' + index}
                    {...trackRowProps}
                  />
                );
              }
            })}
          </tbody>
        </table>
      </Segment>
    );
  }
};

export default TracksResults;
