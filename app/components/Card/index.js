import React from 'react';

import styles from './styles.scss';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.card}>
        <img src={this.props.image}></img>
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
