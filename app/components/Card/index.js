import React from 'react';
import { Image } from 'semantic-ui-react';

import styles from './styles.scss';

var classNames = require('classnames');

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={
          classNames({
            [`${styles.card}`]: true,
            [`${styles.small}`]: this.props.small
          })
        }
        onClick={this.props.onClick}
      >
        <Image src={this.props.image}></Image>
        <div className={styles.container}>
          <h4>{this.props.header}</h4>
          <p>{this.props.content}</p>
        </div>
        {
          this.props.extraContent
          ? <hr />
          : null
        }

        {
          this.props.extraContent
          ? this.props.extraContent
          : null
        }
      </div>
    );
  }
}

export default Card;
