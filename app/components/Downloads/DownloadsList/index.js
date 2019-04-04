import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import DownloadsItem from '../DownloadsItem';

import styles from './styles.scss';

const DownloadsList = props => {
  const {
    items
  } = props;
  
  return (
    <Table inverted>
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
  );
}

DownloadsList.propTypes = {
  items: PropTypes.array
};

DownloadsList.defaultProps = {
  items: []
};

export default DownloadsList;
