import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import DownloadsItem from '../DownloadsItem';

import styles from './styles.scss';

const DownloadsList = ({
  items,
  clearFinishedTracks
}) => {
  const [sortAsc, setSort] = useState(true);
  const [sortArtistAsc, setArtistSort] = useState(true);
  const { t } = useTranslation('downloads');
  return (
    <Segment inverted>
      <Button primary onClick={clearFinishedTracks}>
        <Icon name='trash'/>
        {t('clear')}
      </Button>
      <Table inverted className={styles.downloads_list}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('status')}</Table.HeaderCell>
            <Table.HeaderCell onClick={() => {
              if (sortArtistAsc){
                items.sort((a, b) => {
                  return a.track.artist.name.toLowerCase() > b.track.artist.name.toLowerCase();
                });
                setArtistSort(false);
              } else {
                items.sort((a, b) => {
                  return a.track.artist.name.toLowerCase() < b.track.artist.name.toLowerCase();
                });
                setArtistSort(true);
              }
            }
            }>{t('Artist')} {
                sortArtistAsc ? <Icon name='caret up' /> : <Icon name='caret down' />
              }
            </Table.HeaderCell>
            <Table.HeaderCell onClick={() => {
              if (sortAsc){
                items.sort((a, b) => {
                  return a.track.name.toLowerCase() > b.track.name.toLowerCase();
                });
                setSort(false);
              } else {
                items.sort((a, b) => {
                  return a.track.name.toLowerCase() < b.track.name.toLowerCase();
                });
                setSort(true);
              }
            }
            }>{t('Song')} {
                sortAsc ? <Icon name='caret up' /> : <Icon name='caret down' />
              }
            </Table.HeaderCell>
            <Table.HeaderCell>{t('completion')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items.map(item => {
              return (
                <DownloadsItem
                  key={item.track.uuid}
                  item={item}
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
