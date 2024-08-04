import React, { useMemo, useState } from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';


import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';
import { ArtistTopTrack } from '@nuclear/core/src/plugins/plugins.types';
import TrackTableContainer from '../../../containers/TrackTableContainer';
import TrackTableCell from '@nuclear/ui/lib/components/TrackTable/Cells/TrackTableCell';
import { Cell, CellProps } from 'react-table';
import { Track } from '@nuclear/ui/lib/types';

type AddAllButtonProps = {
  handleAddAll: React.MouseEventHandler;
  t: TFunction;
}

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
      .slice(0, tracks.length > 15 ? 15 : tracks.length)
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
    accessor: (track: ArtistTopTrack) => track.playcount,
    Cell: ({value, ...rest}: CellProps<Track, string>) => <TrackTableCell value={Number(value).toLocaleString()} {...rest} />
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
        <TrackTableContainer
          tracks={
            _(tracks)
              .sortBy('playcount')
              .takeRight(expanded ? 15 : 5)
              .value()
          }
          displayDeleteButton={false}
          displayAlbum={false}
          displayPosition={false}
          displayArtist={false}
          customColumns={customColumns}
        />
        <div className='expand_button' onClick={toggleExpand}>
          <FontAwesome
            name={expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
  );
};

export default PopularTracks;
