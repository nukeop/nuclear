import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import { getThumbnail } from '../../utils';
import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';

type ArtistGridProps = {
  artists: {
    name: string
  } [];
  removeFavoriteArtist: (artist) => void;
  onArtistClick: (artist) => void
  loading?: boolean;
  autoSize?: boolean;
}

export const ArtistGrid: React.FC<ArtistGridProps> = ({
  artists,
  onArtistClick,
  removeFavoriteArtist,
  loading,
  autoSize
}) => {

  return (
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
};

export default ArtistGrid;
