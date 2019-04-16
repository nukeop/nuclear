import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';

import DownloadsItem from '../DownloadsItem';

import styles from './styles.scss';

const DownloadsList = props => {
  const {
    items,
    clearFinishedTracks
  } = props;
  
  return (
    <Segment inverted>
      <Button primary onClick={ clearFinishedTracks }>
        <Icon name='trash'/>
        Clear finished tracks
      </Button>
      <Table inverted className={styles.downloads_list}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Completion</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items.map(item => {
              return (
                <DownloadsItem
                  key={ item.track.id }
                  item={ item }
                />
              );
            })
          }
        </Table.Body>
      </Table>
    </Segment>
  );
};

DownloadsList.propTypes = {
  items: PropTypes.array,
  clearFinishedTracks: PropTypes.func
};

DownloadsList.defaultProps = {
  items: [],
  clearFinishedTracks: () => {}
};

export default DownloadsList;
