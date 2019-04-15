import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'semantic-ui-react';
import _ from 'lodash';

import styles from './styles.scss';

const StatusIcon = props => {
  switch (props.status) {
  case 'Waiting':
    return <Icon name='hourglass start'/>;
  case 'Finished':
    return <Icon name='checkmark' color='green'/>;
  case 'Started':
    return <Icon name='cloud download'/>;
  default:
    return <Icon name='times' color='red'/>;
  }
};

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired
};

const DownloadsItem = props => {
  const {
    item
  } = props;
  
  return (
    <Table.Row>
      <Table.Cell>
        <StatusIcon status={ item.status }/>
        { item.status }
      </Table.Cell>
      <Table.Cell>
        { _.get(item, 'track.artist.name') } - { _.get(item, 'track.name') }
      </Table.Cell>
      <Table.Cell>
        { _.round(item.completion, 2) * 100 + '%' }
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
