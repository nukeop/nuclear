import React from 'react';
import _ from 'lodash';
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
import { ContextPopup, TrackRow, getThumbnail } from '@nuclear/ui';

import TrackPopupButtons from '../../../containers/TrackPopupButtons';
import styles from './styles.scss';

const LibrarySimpleList = ({
  tracks,
  sortBy,
  direction,
  handleSort,
  t
}) => (
  <ReactList
    ref={comp => {
      if (comp) {
        // enables css styling of the container element
        comp.el.className = styles.library_simple_list_container;
      }
    }}
    type='uniform'
    useStaticSize
    length={tracks.length}
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
    itemRenderer={index => {
      const track = _.get(tracks, index);
      const title = track?.name;
      const artist = _.isString(track?.artist) ? track?.artist : track?.artist?.name;

      return (
        <ContextPopup
          trigger={
            <TrackRow
              key={'library-track-' + index}
              track={track}
              displayCover
              displayArtist
              displayAlbum
              withAddToDownloads={false}
            />
          }
          key={'library-track-' + index}
          thumb={getThumbnail(track)}
          title={title}
          artist={artist}
        >
          <TrackPopupButtons
            track={track}
            withAddToDownloads={false}
          />
        </ContextPopup>
      );
    }}
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
