import React from 'react';
import classnames from 'classnames';
import Img from 'react-image-smooth-loading';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

Img.globalPlaceholder = artPlaceholder;

const Card = ({ small, onClick, image, header, content }) => (
  <div className={styles.card_container}>
    <div
      className={classnames({
        [`${styles.card}`]: true,
        [`${styles.small}`]: small
      })}
      onClick={onClick}
    >
      <div className={styles.thumbnail}>
        <Img src={image ? image : artPlaceholder} />
      </div>
      <div className={styles.container}>
        <h4>{header}</h4>
        {content ? <p>{content}</p> : null}
      </div>
    </div>
  </div>
);

export default Card;
