import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Table } from 'semantic-ui-react';

import DownloadsItem from '../DownloadsItem';

import styles from './styles.scss';

const DownloadsList = props => {
  const {
    items
  } = props;
  
  return (
    <Segment inverted>
      <Table inverted className={styles.downloads_list}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Completion</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {
          items.map(item => {
            return (
              <DownloadsItem
                item={ item }
              />
            );
          })
        }
      </Table>
    </Segment>
  );
};

DownloadsList.propTypes = {
  items: PropTypes.array
};

DownloadsList.defaultProps = {
  items: []
};

export default DownloadsList;
