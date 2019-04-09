import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';

import styles from './styles.scss';

const DownloadsItem = props => {
  const {
    item
  } = props;
  
  return (
    <Table.Row>
      <Table.Cell>
        { item.status }
      </Table.Cell>
      <Table.Cell>
        { _.get(item, 'track.artist.name') } - { _.get(item, 'track.name') }
      </Table.Cell>
      <Table.Cell>
        { item.completion }
      </Table.Cell>
    </Table.Row>
  );
};

DownloadsItem.propTypes = {
  item: PropTypes.shape({
    
  })
};

DownloadsItem.defaultProps = {
  item: {}
};

export default DownloadsItem;
