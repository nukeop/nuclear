import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer,
  Input,
  Segment
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { LibraryListTypeToggle } from '@nuclear/ui';
import { LIST_TYPE } from '@nuclear/ui/lib/components/LibraryListTypeToggle';
import _ from 'lodash';

import Header from '../Header';
import EmptyState from './EmptyState';
import NoApi from './NoApi';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './index.scss';
import NoSearchResults from './NoSearchResults';
import LibraryFolders from './LibraryFolders';
import LibrarySimpleList from './LibrarySimpleList';
import LibraryAlbumGrid from './LibraryAlbumGrid';

const LibraryView = ({
  tracks,
  filterApplied,
  actions,
  pending,
  scanProgress,
  scanTotal,
  localFolders,
  sortBy,
  direction,
  listType,
  api
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
      <Header>{t('header')}</Header>
      <LibraryFolders
        openLocalFolderPicker={actions.openLocalFolderPicker}
        scanLocalFolders={actions.scanLocalFolders}
        removeLocalFolder={actions.removeLocalFolder}
        localFolders={localFolders}
        scanTotal={scanTotal}
        scanProgress={scanProgress}
        loading={pending}
      />
      <Segment>
        {api ? (
          <React.Fragment>
            <div className={styles.search_field_row}>
              <Input
                inverted
                transparent
                icon='search'
                iconPosition='left'
                placeholder={t('filter-placeholder')}
                onChange={actions.updateFilter}
              />

              <LibraryListTypeToggle
                listType={listType}
                toggleListType={actions.updateLibraryListType}
              />
            </div>
            {
              _.isEmpty(tracks) ? (
                filterApplied ? (
                  <NoSearchResults />
                ) : (
                  <EmptyState />
                )
              ) : (
                <Segment inverted className={trackRowStyles.tracks_container}>
                  <Dimmer active={pending} loading={pending.toString()} />

                  {
                    !pending &&
                    listType === LIST_TYPE.SIMPLE_LIST &&
                    <LibrarySimpleList
                      tracks={tracks}
                      sortBy={sortBy}
                      direction={direction}
                      handleSort={handleSort}
                    />
                  }

                  {
                    !pending &&
                  !_.isEmpty(localFolders) &&
                  listType === LIST_TYPE.ALBUM_GRID &&
                  <LibraryAlbumGrid
                    tracks={tracks}
                  />
                  }
                </Segment>
              )}
          </React.Fragment>
        ) : (
          <NoApi enableApi={actions.setBooleanOption} />
        )}


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
  // byArtist: PropTypes.object,
  actions: PropTypes.object,
  sortBy: PropTypes.string,
  direction: PropTypes.string
};

export default LibraryView;
