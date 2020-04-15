import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Input, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { LibraryListTypeToggle } from '@nuclear/ui';
import { LIST_TYPE } from '@nuclear/ui/lib/components/LibraryListTypeToggle';
import _ from 'lodash';

import EmptyState from './EmptyState';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './index.scss';
import NoSearchResults from './NoSearchResults';
import LibrarySimpleList from './LibrarySimpleList';
import LibraryFolderTree from './LibraryFolderTree';
import LibraryAlbumGrid from './LibraryAlbumGrid';
import LibraryHeader from './LibraryHeader';

const LibraryView = ({
  tracks,
  filterApplied,
  streamProviders,
  actions,
  queueActions,
  playerActions,
  pending,
  scanProgress,
  scanTotal,
  localFolders,
  sortBy,
  direction,
  listType
}) => {
  const handleSort = useCallback(
    columnName => () => {
      actions.updateLocalSort(columnName, sortBy, direction);
    },
    [actions, sortBy, direction]
  );
  const { t } = useTranslation('library');

  return (
    <div className={styles.local_files_view}>
      <LibraryHeader
        openLocalFolderPicker={actions.openLocalFolderPicker}
        scanLocalFolders={actions.scanLocalFolders}
        removeLocalFolder={actions.removeLocalFolder}
        localFolders={localFolders}
        scanTotal={scanTotal}
        scanProgress={scanProgress}
        loading={pending}
      />
      <Segment className={styles.library_contents}>
        <>
          <div className={styles.search_field_row}>
            <Input
              inverted
              transparent
              icon='search'
              iconPosition='left'
              placeholder={t('filter-placeholder')}
              onChange={actions.updateFilter}
            />

            <LibraryListTypeToggle listType={listType} toggleListType={actions.updateLibraryListType} />
          </div>
          {_.isEmpty(tracks) ? (
            filterApplied ? (
              <NoSearchResults />
            ) : (
              <EmptyState />
            )
          ) : (
            <Segment inverted className={trackRowStyles.tracks_container}>
              <Dimmer active={pending} loading={pending.toString()} />

              {!pending && listType === LIST_TYPE.SIMPLE_LIST && (
                <LibrarySimpleList tracks={tracks} sortBy={sortBy} direction={direction} handleSort={handleSort} />
              )}

              {!pending && !_.isEmpty(localFolders) && listType === LIST_TYPE.ALBUM_GRID && (
                <LibraryAlbumGrid
                  tracks={tracks}
                  streamProviders={streamProviders}
                  addToQueue={queueActions.addToQueue}
                  clearQueue={queueActions.clearQueue}
                  selectSong={queueActions.selectSong}
                  startPlayback={playerActions.startPlayback}
                  withArtistNames
                  withAlbumPreview
                />
              )}

              {!pending && listType === LIST_TYPE.FOLDER_TREE && (
                <LibraryFolderTree tracks={tracks} sortBy={sortBy} direction={direction} handleSort={handleSort} />
              )}
            </Segment>
          )}
        </>
      </Segment>
    </div>
  );
};

LibraryView.propTypes = {
  tracks: PropTypes.array,
  filterApplied: PropTypes.bool,
  pending: PropTypes.bool,
  scanProgress: PropTypes.number,
  scanTotal: PropTypes.number,
  localFolders: PropTypes.arrayOf(PropTypes.string),
  streamProviders: PropTypes.array,
  actions: PropTypes.object,
  queueActions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func,
    selectSong: PropTypes.func,
    playTrack: PropTypes.func
  }),
  playerActions: PropTypes.shape({
    startPlayback: PropTypes.func
  }),
  sortBy: PropTypes.string,
  direction: PropTypes.string
};

export default LibraryView;
