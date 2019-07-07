import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dimmer,
  Divider,
  Icon,
  Input,
  List,
  Segment,
  Table
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import Header from '../Header';
import TrackRow from '../TrackRow';
import EmptyState from './EmptyState';
import NoApi from './NoApi';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './index.scss';

const LibraryView = ({
  tracks,
  actions,
  pending,
  localFolders,
  sortBy,
  direction,
  api
}) => {
  const handleSort = useCallback(
    columnName => () => {
      actions.updateLocalSort(columnName, sortBy, direction);
    },
    [sortBy, direction, actions.updateLocalSort]
  );
  const { t } = useTranslation('library');

  return (
    <div className={styles.local_files_view}>
      <Header>{t('header')}</Header>
      <Segment>
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
          loading={pending}
          onClick={actions.scanLocalFolders}
          className={styles.refresh_icon}
        />
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
      </Segment>
      <Segment>
        {api ? (
          _.isEmpty(tracks) ? (
            <EmptyState />
          ) : (
            <React.Fragment>
              <div className={styles.search_field}>
                <Input
                  inverted
                  transparent
                  icon='search'
                  iconPosition='left'
                  placeholder={t('filter-placeholder')}
                  onChange={actions.updateFilter}
                />
              </div>

              <Segment inverted className={trackRowStyles.tracks_container}>
                <Dimmer active={pending} loading={pending.toString()} />

                {!pending && (
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
                    <Table.Body className={styles.tbody}>
                      {tracks &&
                        tracks.map((track, idx) => (
                          <TrackRow
                            key={'favorite-track-' + idx}
                            track={track}
                            index={idx}
                            displayCover
                            displayArtist
                            displayAlbum
                            withAddToDownloads={false}
                            isLocal
                          />
                        ))}
                    </Table.Body>
                  </Table>
                )}
              </Segment>
            </React.Fragment>
          )
        ) : (
          <NoApi enableApi={actions.setBooleanOption} />
        )}
      </Segment>
    </div>
  );
};

LibraryView.propTypes = {
  pending: PropTypes.bool,
  tracks: PropTypes.array,
  localFolders: PropTypes.arrayOf(PropTypes.string),
  // byArtist: PropTypes.object,
  actions: PropTypes.object,
  sortBy: PropTypes.string,
  direction: PropTypes.string
};

export default LibraryView;
