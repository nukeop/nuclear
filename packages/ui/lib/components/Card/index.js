import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import common from '../../common.scss';
import styles from './styles.scss';

const Card = ({
  header,
  content,
  image,
  onClick
}) => (
  <div className={cx(
    common.nuclear,
    styles.card_container
  )}>
    <div
      className={styles.card}
      onClick={onClick}
    >
      <div className={styles.thumbnail}
        style={{backgroundImage: `url('${(_.isNil(image) || _.isEmpty(image)) ? artPlaceholder : image}')`}}
      />
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
  image: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func
};

export default Card;
