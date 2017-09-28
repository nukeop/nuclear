import React from 'react';
import { Image } from 'semantic-ui-react';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

var classNames = require('classnames');

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.card_container}>
        <div
          className={
            classNames({
              [`${styles.card}`]: true,
              [`${styles.small}`]: this.props.small
            })
          }
          onClick={this.props.onClick}
        >
          <div className={styles.thumbnail}>
            <div style={{
                        background: `url('${this.props.image}')`,
                        backgroundRepeat: 'noRepeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}></div>
          </div>
          <div className={styles.container}>
            <h4>{this.props.header}</h4>
            {
              this.props.content
              ? <p>{this.props.content}</p>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
