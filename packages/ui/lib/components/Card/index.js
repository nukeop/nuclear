import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Img from 'react-image-smooth-loading';
import _ from 'lodash';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import common from '../../common.scss';
import styles from './styles.scss';

Img.globalPlaceholder = artPlaceholder;
const Card = ({
  header,
  content,
  image,
  small,
  onClick
}) => (
  <div className={cx(
    styles.card_container,
    {[`${styles.small}`]: small}
  )}>
    <div
      className={cx(
        common.nuclear,
        styles.card
      )}
      onClick={onClick}
    >
      <div className={styles.thumbnail}>
        <Img src={_.defaultTo(image, artPlaceholder)} />
      </div>
      <div className={styles.card_content}>
        <h4>{header}</h4>
        {
          _.isNil(content)
            ? null
            : <p>{content}</p>
        }
      </div>
    </div>
  </div>
);

Card.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string,
  image: PropTypes.string,
  small: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
