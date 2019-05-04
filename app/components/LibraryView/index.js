import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Segment, Button, List, Input, Table } from 'semantic-ui-react';

import Header from '../Header';
import TrackRow from '../TrackRow';

import styles from './index.scss';

const LibraryView = ({
  tracks,
  actions,
  pending,
  localFolders,
  sortBy,
  direction
}) => {
  const handleSort = columnName => () => {
    actions.updateLocalSort(columnName, sortBy, direction);
  };

  return (
    <div className={styles.local_files_view}>
      <Header>
        Local Library
      </Header>
      <Segment>
        <Button
          icon='folder open'
          className={styles.add_folder}
          onClick={actions.openLocalFolderPicker}
        />
        <List divided verticalAlign='middle' className={styles.equalizer_list}>
          {localFolders.map((folder, idx) => (
            <List.Item key={idx}>
              <List.Content floated='right'>
                <Icon
                  name='trash alternate'
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
        <Button
          icon='refresh'
          loading={pending}
          onClick={actions.scanLocalFolders}
          className={styles.refresh_icon}
        />
        <Input icon='search' placeholder='Search...' onChange={actions.updateFilter} />
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
                  Artist
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={sortBy === 'name' ? direction : null}
                  onClick={handleSort('name')}
                >
                  Title
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className={styles.tbody}>
              {tracks && tracks.map((track, idx) => (
                <TrackRow
                  key={'favorite-track-' + idx}
                  track={track}
                  index={idx}
                  displayCover
                  displayArtist
                  withAddToDownloads={false}
                  isLocal
                />
              ))}
            </Table.Body>
          </Table>
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
