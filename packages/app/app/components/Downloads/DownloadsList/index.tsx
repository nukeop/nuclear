import React, { useState } from 'react';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import DownloadsItem from '../DownloadsItem';
import styles from './styles.scss';
import { Download } from '@nuclear/ui/lib/types';

type DownloadsListProps = {
  items: Download[];
  clearFinishedTracks: React.MouseEventHandler;
  resumeDownload: (id: string) => void;
  pauseDownload: (id: string) => void;
  removeDownload: (id: string) => void;
};

const DownloadsList: React.FC<DownloadsListProps> = ({
  items,
  clearFinishedTracks,
  pauseDownload,
  resumeDownload,
  removeDownload
}) => {
  const [sortAsc, setSortAsc] = useState(true);
  const { t } = useTranslation('downloads');

  const onSort = () => {
    const sortResult = items.sort((a, b) => (a.track.name.toLowerCase() > b.track.name.toLowerCase())
      ? sortAsc ? 1 : -1
      : sortAsc ? -1 : 1
    );
    setSortAsc(!sortAsc);
    return sortResult;
  };

  return (
    <Segment inverted>
      <Button primary onClick={clearFinishedTracks}>
        <Icon name='trash' />
        {t('clear')}
      </Button>
      <Table inverted unstackable className={styles.downloads_list}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('status')}</Table.HeaderCell>
            <Table.HeaderCell
              onClick={onSort}
            >
              {t('name')} {
                sortAsc ? <Icon name='caret up' /> : <Icon name='caret down' />
              }
            </Table.HeaderCell>
            <Table.HeaderCell>{t('completion')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items.map(item => {
              return (
                <DownloadsItem
                  key={item.track.uuid}
                  item={item}
                  resumeDownload={resumeDownload}
                  pauseDownload={pauseDownload}
                  removeDownload={removeDownload}
                />
              );
            })
          }
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default DownloadsList;
