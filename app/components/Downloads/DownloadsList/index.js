import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import DownloadsItem from '../DownloadsItem';

import styles from './styles.scss';

const DownloadsList = ({
  items,
  clearFinishedTracks
}) => {
  const { t } = useTranslation('downloads');
  
  return (
    <Segment inverted>
      <Button primary onClick={ clearFinishedTracks }>
        <Icon name='trash'/>
        {t('clear')}
      </Button>
      <Table inverted className={styles.downloads_list}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('status')}</Table.HeaderCell>
            <Table.HeaderCell>{t('name')}</Table.HeaderCell>
            <Table.HeaderCell>{t('completion')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items.map(item => {
              return (
                <DownloadsItem
                  key={ item.track.uuid }
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
