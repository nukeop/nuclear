import React from 'react';
import ReactList from 'react-list';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Icon,
  Ref,
  Table
} from 'semantic-ui-react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { TrackRow } from '@nuclear/ui';

import styles from './styles.scss';

const LibrarySimpleList = ({
  tracks,
  sortBy,
  direction,
  handleSort,
  t
}) => (
  <ReactList
    type='variable'
    length={tracks.length}
    itemSizeEstimator={() => 44}
    itemsRenderer={(items, ref) => (
      <Table
        sortable
        className={cx(
          styles.library_simple_list,
          styles.table
        )}
      >
        <Table.Header className={styles.thead}>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name='image' />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortBy === 'artist' ? direction : null}
              onClick={handleSort('artist')}
            >
              {t('artist')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortBy === 'name' ? direction : null}
              onClick={handleSort('name')}
            >
              {t('title')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortBy === 'album' ? direction : null}
              onClick={handleSort('album')}
            >
              {t('album')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Ref innerRef={ref}>
          <Table.Body className={styles.tbody}>
            {items}
          </Table.Body>
        </Ref>
      </Table>
    )}
    itemRenderer={index => (
      <TrackRow
        key={'library-track-'+index}
        track={tracks[index]}
        displayCover
        displayArtist
        displayAlbum
        withAddToDownloads={false}
        isLocal
      />
    )}
  />
);

LibrarySimpleList.propTypes = {
  tracks: PropTypes.array,
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  handleSort: PropTypes.func
};

export default compose(
  withTranslation('library')

)(LibrarySimpleList);
