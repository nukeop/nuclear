import React, { Component } from 'react';

import styles from './Heading.css';

export default class PitchforkReviewMini extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.heading}>
        {this.props.text}
      </div>
    );
  }
}
