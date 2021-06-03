import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { compose, withState, withHandlers } from 'recompose';

import { getThumbnail } from '../../utils';
import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';

const ArtistGrid = ({
  artists,
  onArtistClick,
  removeFavoriteArtist,
  loading,
  autoSize
}) => (
  <div className={cx(
    common.nuclear,
    styles.artist_grid,
    { [styles.loading]: loading },
    { [styles.auto_size]: autoSize && !loading }
  )} >
    <div className={styles.artist_cards}>
      {
        !loading &&
          !_.isEmpty(artists) &&
          artists.map((artist, i) => (
            <Card
              key={i}
              header={artist.name}
              image={getThumbnail(artist)}
              onClick={() => onArtistClick(artist)}
              withMenu={removeFavoriteArtist ? true : false}
              menuEntries={[
                {
                  type: 'item', props: {
                    children: 'Remove',
                    onClick: () => removeFavoriteArtist(artist)
                  }
                }
              ]}
            />
          ))
      }
    </div>

    {loading && <Dimmer active><Loader /></Dimmer>}
  </div>
);

ArtistGrid.propTypes = {
  artists: PropTypes.array,
  streamProviders: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  onArtistClick: PropTypes.func,
  removeFavoriteArtist: PropTypes.func,
  loading: PropTypes.bool,
  autoSize: PropTypes.bool
};

export default compose(
  withState(
    'selectedArtist',
    'selectArtist',
    ({ artists }) => _.head(artists)
  ),
  withHandlers({
    onArtistClick: ({ onArtistClick, selectArtist }) => artist => _.isNil(onArtistClick) ? selectArtist(artist) : onArtistClick(artist)
  })
)(ArtistGrid);
