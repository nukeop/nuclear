import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dimmer, Input, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { LibraryListTypeToggle } from '@nuclear/ui';
import { LIST_TYPE } from '@nuclear/ui/lib/components/LibraryListTypeToggle';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import EmptyState from './EmptyState';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './index.scss';
import NoSearchResults from './NoSearchResults';
import LibrarySimpleList from './LibrarySimpleList';
import LibraryFolderTree from './LibraryFolderTree';
import LibraryAlbumGrid from './LibraryAlbumGrid';
import LibraryHeader from './LibraryHeader';
import * as LocalActions from '../../actions/local';
import * as QueueActions from '../../actions/queue';
import * as PlayerActions from '../../actions/player';
import * as SettingsActions from '../../actions/settings';
import { sortTracks } from './utils';

const LibraryView = ({pending, scanProgress, scanTotal, localFolders, sortBy, direction, listType}) => {
  const filter = useSelector(state => state.local.filter);
  const tracksMap = useSelector(state => state.local.tracks);
  const expandedFolders = useSelector(state => state.local.expandedFolders);
  const streamProviders = useSelector(state => state.plugin.plugins.streamProviders);
  const localStreamProviders = useMemo(() => _.filter(streamProviders, { sourceName: 'Local' }), [streamProviders]);

  const unfilteredTracks = useMemo(() => _.values(tracksMap), [tracksMap]);
  const tracks = useMemo(() => {
    const checkFilter = string => _.includes(_.lowerCase(string), lowercaseFilter);
    const lowercaseFilter = _.lowerCase(filter);
    const filteredTracks = _.filter(unfilteredTracks, track => {
      return _.some([
        checkFilter(track.name),
        checkFilter(track.album),
        checkFilter(_.get(track, 'artist.name'))
      ]);
    });
    const tracksPreDirection = sortTracks(filteredTracks, sortBy);
    return direction === 'ascending' ? tracksPreDirection : tracksPreDirection.reverse();
  }, [unfilteredTracks, filter, sortBy, direction]);
  const filterApplied = useMemo(() => tracks.length < unfilteredTracks.length, [tracks, unfilteredTracks]);

  const dispatch = useDispatch();
  const actions = bindActionCreators({ ...LocalActions, ...SettingsActions }, dispatch);
  const queueActions = bindActionCreators(QueueActions, dispatch);
  const playerActions = bindActionCreators(PlayerActions, dispatch);

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
                  streamProviders={localStreamProviders}
                  addToQueue={queueActions.addToQueue}
                  clearQueue={queueActions.clearQueue}
                  selectSong={queueActions.selectSong}
                  startPlayback={playerActions.startPlayback}
                  withArtistNames
                  withAlbumPreview
                />
              )}

              {!pending && listType === LIST_TYPE.FOLDER_TREE && (
                <LibraryFolderTree tracks={tracks} localFolders={localFolders} expandedFolders={expandedFolders} />
              )}
            </Segment>
          )}
        </>
      </Segment>
    </div>
  );
};

LibraryView.propTypes = {
  pending: PropTypes.bool,
  scanProgress: PropTypes.number,
  scanTotal: PropTypes.number,
  localFolders: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  listType: PropTypes.string
};

export default LibraryView;
