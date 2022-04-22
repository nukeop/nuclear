import React, { useCallback } from 'react';
import { Icon, SemanticICONS, Table } from 'semantic-ui-react';
import _ from 'lodash';
import styles from './styles.scss';
import { Download } from '@nuclear/ui/lib/types';

type DownloadsItemProps = {
  item: Download
  resumeDownload: (id: string) => void;
  pauseDownload: (id: string) => void;
  removeDownload: (id: string) => void;
}

type StatusIconProps = Pick<DownloadsItemProps['item'], 'status'>;

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
  case 'Waiting':
    return <Icon name='hourglass start' />;
  case 'Paused':
    return <Icon name='pause circle' />;
  case 'Finished':
    return <Icon name='checkmark' color='green' />;
  case 'Started':
    return <Icon name='cloud download' />;
  case 'Error':
  default:
    return <Icon name='times' color='red' />;
  }
};

const renderAction = (name: SemanticICONS, callback: React.MouseEventHandler) => (
  <a
    data-testid='download-action'
    href='#'
    onClick={callback}
  >
    <Icon fitted name={name} />
  </a>
);

const ActionIcon = props => {
  const { item, pauseDownload, resumeDownload } = props;
  switch (item.status) {
  case 'Waiting':
  case 'Started':
    return renderAction('pause', pauseDownload);
  case 'Paused':
    return renderAction('play', resumeDownload);
  case 'Error':
  default:
    return renderAction('redo', resumeDownload);
  }
};

const DownloadsItem: React.FC<DownloadsItemProps> = ({
  item,
  resumeDownload,
  pauseDownload,
  removeDownload
}) => {
  const artistName = _.isString(_.get(item, 'track.artist'))
    ? _.get(item, 'track.artist')
    : _.get(item, 'track.artist.name');
  const onResumeClick = useCallback(() => resumeDownload(item.track.uuid), [item, resumeDownload]);
  const onPauseClick = useCallback(() => pauseDownload(item.track.uuid), [item, pauseDownload]);
  const onRemoveClick = useCallback(() => removeDownload(item.track.uuid), [item, removeDownload]);
  return (
    <Table.Row className={styles.downloads_item}>
      <Table.Cell>
        <StatusIcon status={item.status} />
        {item.status}
      </Table.Cell>
      <Table.Cell>
        {artistName} - {_.get(item, 'track.name')}
      </Table.Cell>
      <Table.Cell>
        {_.round(item.completion * 100, 0) + '%'}
      </Table.Cell>
      <Table.Cell className={styles.item_buttons}>
        <ActionIcon 
          resumeDownload={onResumeClick} 
          pauseDownload={onPauseClick} 
          item={item} 
        />
        <a
          data-testid='remove-download'
          href='#' 
          onClick={onRemoveClick}
        >
          <Icon fitted name='times' />
        </a>
      </Table.Cell>
    </Table.Row>
  );
};

export default DownloadsItem;
