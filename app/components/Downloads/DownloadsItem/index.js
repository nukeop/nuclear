import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import styles from './styles.scss';

const DownloadsItem = props => {
  const {
    item
  } = props;
  
  return (
    <Table.Row>
      <Table.Cell>
        { item.name }
      </Table.Cell>
    </Table.Row>
  );
}

DownloadsItem.propTypes = {
  item: PropTypes.shape({
    
  })
};

DownloadsItem.defaultProps = {
  item: {}
};

export default DownloadsItem;
