import React, { useCallback } from 'react';
import ReactList from 'react-list';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Divider,
  Icon,
  Input,
  List,
  Progress,
  Segment,
  Table,
  Ref
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { LibraryListTypeToggle } from '@nuclear/ui';
import _ from 'lodash';

import Header from '../Header';
import TrackRow from '../TrackRow';
import EmptyState from './EmptyState';
import NoApi from './NoApi';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './index.scss';
import NoSearchResults from './NoSearchResults';

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
  console.log(listType)

  return (
    <div className={styles.local_files_view}>
      <Header>{t('header')}</Header>
      <Segment>
        <Segment className={styles.control_bar}>
          <Button
            icon
            inverted
            labelPosition='left'
            className={styles.add_folder}
            onClick={actions.openLocalFolderPicker}
          >
            <Icon name='folder open' />
            {t('add')}
          </Button>
          <Button
            inverted
            icon='refresh'
            disabled={localFolders.length < 1}
            loading={pending}
            onClick={actions.scanLocalFolders}
            className={styles.refresh_icon}
          />
          {scanTotal && (
            <Progress className={styles.progress_bar} value={scanProgress} total={scanTotal} progress='ratio' />
          )}
        </Segment>
        {localFolders.length > 0 &&
          <>
            <Divider />
            <List divided verticalAlign='middle' className={styles.equalizer_list}>
              {localFolders.map((folder, idx) => (
                <List.Item key={idx}>
                  <List.Content floated='right'>
                    <Icon
                      name='close'
                      onClick={() => actions.removeLocalFolder(folder)}
                      className={styles.folder_remove_icon}
                    />
                  </List.Content>
                  <List.Content>{folder}</List.Content>
                </List.Item>
              ))}
            </List>
          </>
        }
      </Segment>
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
            {_.isEmpty(tracks) ? (
              filterApplied ? (
                <NoSearchResults />
              ) : (
                <EmptyState />
              )
            ) : (
              <Segment inverted className={trackRowStyles.tracks_container}>
                <Dimmer active={pending} loading={pending.toString()} />

                {!pending && (
                  <ReactList
                    type='variable'
                    length={tracks.length}
                    itemSizeEstimator={() => 44}
                    itemsRenderer={(items, ref) => {
                      return (
                        <Table sortable className={styles.table}>
                          <Table.Header className={styles.thead}>
                            <Table.Row>
                              <Table.HeaderCell>
                                <Icon name='image' />
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                sorted={sortBy === 'artist' ? direction : null}
                                onClick={handleSort('artist')}
                              >
                                {t('artist')}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                sorted={sortBy === 'name' ? direction : null}
                                onClick={handleSort('name')}
                              >
                                {t('title')}
                              </Table.HeaderCell>
                              <Table.HeaderCell
                                sorted={sortBy === 'album' ? direction : null}
                                onClick={handleSort('album')}
                              >
                                {t('album')}
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Ref innerRef={ref}>
                            <Table.Body className={styles.tbody}>
                              {items}
                            </Table.Body>
                          </Ref>
                        </Table>
                      );
                    }}
                    itemRenderer={index => {
                      const track = tracks[index];
                      return (
                        <TrackRow
                          key={'favorite-track-' + index}
                          track={track}
                          index={index}
                          displayCover
                          displayArtist
                          displayAlbum
                          withAddToDownloads={false}
                          isLocal
                        />
                      );
                    }}/>
                )}
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
