import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'semantic-ui-react';
import _ from 'lodash';

const StatusIcon = props => {
  switch (props.status) {
  case 'Waiting':
    return <Icon name='hourglass start'/>;
  case 'Finished':
    return <Icon name='checkmark' color='green'/>;
  case 'Started':
    return <Icon name='cloud download'/>;
  case 'Error':
  default:
    return <Icon name='times' color='red'/>;
  }
};

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired
};

const DownloadsItem = ({
  item
}) => {
  const artistName = _.isString(_.get(item, 'track.artist'))
    ? _.get(item, 'track.artist')
    : _.get(item, 'track.artist.name');
  
  return (
    <Table.Row>
      <Table.Cell>
        <StatusIcon status={item.status}/>
        { item.status }
      </Table.Cell>
      <Table.Cell>
        { artistName } - { _.get(item, 'track.name') }
      </Table.Cell>
      <Table.Cell>
        { artistName } - { _.get(item, 'track.name') }
      </Table.Cell>
      <Table.Cell>
        { _.round(item.completion*100, 0)  + '%' }
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
