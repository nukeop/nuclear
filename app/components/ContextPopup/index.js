import React from 'react';
import { Popup } from 'semantic-ui-react';

import styles from './styles.scss';

class ContextPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Popup
        className={styles.popup_content}
        trigger={this.props.trigger}
        on='click'
      >
        <div className={styles.popup_header}>
          <div className={styles.popup_thumb}><img src={this.props.thumb} /></div>
          <div className={styles.popup_info}>
            <div className={styles.popup_title}>{this.props.title}</div>
            <div className={styles.popup_artist}>by {this.props.artist}</div>
          </div>
        </div>

        <hr />

        <div className={styles.popup_buttons}>
          {this.props.children}
        </div>

      </Popup>
    );
  }
}

export default ContextPopup;
