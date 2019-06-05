import React from 'react';
import classnames from 'classnames';
import Img from 'react-image-smooth-loading';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

Img.globalPlaceholder = artPlaceholder;

const Card = () => (
  <div className={styles.card_container}>
    <div
      className={classnames({
        [`${styles.card}`]: true,
        [`${styles.small}`]: this.props.small
      })}
      onClick={this.props.onClick}
    >
      <div className={styles.thumbnail}>
        <Img src={this.props.image ? this.props.image : artPlaceholder} />
      </div>
      <div className={styles.container}>
        <h4>{this.props.header}</h4>
        {this.props.content ? <p>{this.props.content}</p> : null}
      </div>
    </div>
  </div>
);

export default Card;
