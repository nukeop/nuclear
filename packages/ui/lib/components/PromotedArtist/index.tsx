import React from 'react';
import { Icon } from 'semantic-ui-react';
import Button from '../Button';

import blobMask from '../../../resources/media/blob_mask.png';
import blobMaskShadow from '../../../resources/media/blob_mask_shadow.png';
import styles from './styles.scss';

type PromotedArtistProps = {
    name: string;
    description?: string;
    imageUrl: string;
    backgroundImageUrl?: string;
    externalUrl: string;
  onListenClick: React.MouseEventHandler;
}

const PromotedArtist: React.FC<PromotedArtistProps> = ({
  name,
  description,
  imageUrl,
  backgroundImageUrl,
  externalUrl,
  onListenClick
}) => {
  return <div 
    className={styles.promoted_artist}
    style={{
      backgroundImage: backgroundImageUrl && `url(${backgroundImageUrl})`
    }}
  >
    <div className={styles.promoted_artist_info}>
      <div className={styles.name}>
        {name}
      </div>
      {
        description &&
        <div className={styles.description}>
          {description}
        </div>
      }
      <div className={styles.spacer} />
      <div className={styles.button_row}>
        <Button 
          className={styles.promoted_artist_button}
          circular 
          onClick={onListenClick}
          color='pink'
        >
          <Icon name='itunes note' />
          Check out 
        </Button>
        <Button 
          className={styles.promoted_artist_button}
          text
          as={'a'}
          href={externalUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Icon name='external' />
          External link
        </Button>
      </div>
    </div>
    <div className={styles.promoted_artist_image}>
      <img
        src={imageUrl} 
        className={styles.image}
        style={{
          maskImage: `url(${blobMask})`,
          WebkitMask: `url(${blobMask})`
        }}
      />
      <img
        src={blobMaskShadow}
        className={styles.mask_shadow}
      />
    </div>
  </div>;
};

export default PromotedArtist;

