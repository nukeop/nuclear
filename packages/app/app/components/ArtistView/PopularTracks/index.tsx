import React, { useMemo, useState } from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { ArtistTopTrack } from '@nuclear/core/src/plugins/plugins.types';
import { TextCell } from '@nuclear/ui/lib/components/GridTrackTable/Cells/TextCell';
import { Track } from '@nuclear/ui/lib/types';

import TrackTableContainer from '../../../containers/TrackTableContainer';
import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';

type AddAllButtonProps = {
  handleAddAll: React.MouseEventHandler;
  t: TFunction;
}

const MAX_POPULAR_TRACKS_DISPLAYED = 15;

export const AddAllButton: React.FC<AddAllButtonProps> = ({
  handleAddAll,
  t
}) => {
  return (
    <Button
      primary
      href='#'
      onClick={handleAddAll}
      className={styles.add_all_button}
      aria-label={t('add-all')}
    >
      <FontAwesome name='plus' /> {t('add-all')}
    </Button>
  );
};


type PopularTracksProps = {
  artist: {
    name: string;
  };
  tracks: ArtistTopTrack[];
  addToQueue: (track) => Promise<void> ;
}

const PlaycountColumnId = 'playcount';

const PopularTracks: React.FC<PopularTracksProps> = ({
  artist,
  tracks,
  addToQueue
}) => {
  const { t } = useTranslation('artist');
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  const handleAddAll = () => {
    tracks
      .slice(0, Math.min(tracks.length, MAX_POPULAR_TRACKS_DISPLAYED))
      .forEach(track => {
        addToQueue({
          artist: artist.name,
          name: track.title,
          thumbnail: track.thumb
        });
      });
  };

  const customColumns = useMemo(() => [{
    id: PlaycountColumnId,
    Header: t('count'),
    accessor: (track: Track) => Number(track.playcount).toLocaleString(),
    Cell: TextCell
  }], []);

  return (
    !_.isEmpty(tracks) &&
      <div className={cx(
        styles.popular_tracks_container,
        trackRowStyles.tracks_container
      )}>
        <div className={styles.header}>{t('popular-tracks')}</div>
        <AddAllButton 
          handleAddAll={handleAddAll}
          t={t}
        />
        <div
          className={styles.popular_tracks_table_container}
          style={{ height: expanded ? `calc(48px + (${Math.min(tracks.length, MAX_POPULAR_TRACKS_DISPLAYED)}*42px))` : undefined }}
        >
          <TrackTableContainer
            tracks={
              _(tracks)
                .sortBy('playcount')
                .takeRight(expanded ? MAX_POPULAR_TRACKS_DISPLAYED : 5)
                .value()
            }
            displayDeleteButton={false}
            displayAlbum={false}
            displayPosition={false}
            displayArtist={false}
            customColumns={customColumns}
          />
        </div>
        <div className='expand_button' onClick={toggleExpand}>
          <FontAwesome
            name={expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
  );
};

export default PopularTracks;
