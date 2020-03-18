import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'semantic-ui-react';
import _ from 'lodash';

const StatusIcon = props => {
  switch (props.status) {
  case 'Waiting':
    return <Icon name='hourglass start'/>;
  case 'Paused':
    return <Icon name='pause circle'/>;
  case 'Finished':
    return <Icon name='checkmark' color='green'/>;
  case 'Started':
    return <Icon name='cloud download'/>;
  case 'Error':
  default:
    return <Icon name='times' color='red'/>;
  }
};

const renderAction = (name, callback, uuid) => (
  <a
    onClick={() => callback(uuid)}
    href='#'
  >
    <Icon name={name} />
  </a>
);

const ActionIcon = props => {
  const {item, pauseDownload, resumeDownload} = props;
  switch (item.status){
  case 'Waiting':
  case 'Started':
    return renderAction('pause', pauseDownload, item.track.uuid);
  case 'Paused':
    return renderAction('play', resumeDownload, item.track.uuid);
  case 'Error':
  default:
    return renderAction('redo', resumeDownload, item.track.uuid);
  }
};

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired
};

ActionIcon.propTypes = {
  item: PropTypes.PropTypes.shape({
    status: PropTypes.string.isRequired,
    track: PropTypes.PropTypes.shape({
      uuid: PropTypes.string.isRequired
    })
  }),
  resumeDownload: PropTypes.func.isRequired,
  pauseDownload: PropTypes.func.isRequired
};

const DownloadsItem = ({
  item,
  resumeDownload,
  pauseDownload
}) => {
  const artistName = _.isString(_.get(item, 'track.artist'))
    ? _.get(item, 'track.artist')
    : _.get(item, 'track.artist.name');
  const onResumeClick=(uuid) => {
    resumeDownload(uuid);
  };
  const onPauseClick=(uuid) => {
    pauseDownload(uuid);
  };
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
        { _.round(item.completion*100, 0)  + '%' }
      </Table.Cell>
      <Table.Cell>
        <ActionIcon resumeDownload={onResumeClick} pauseDownload={onPauseClick} item={item}/>
      </Table.Cell>
      
    </Table.Row>
  );
};

DownloadsItem.propTypes = {
  item: PropTypes.shape({
    
  }),
  resumeDownload: PropTypes.func.isRequired,
  pauseDownload: PropTypes.func.isRequired
};

DownloadsItem.defaultProps = {
  item: {},
  pauseDownload: () => {},
  resumeDownload: () => {}
};

export default DownloadsItem;
