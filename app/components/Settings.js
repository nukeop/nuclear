import React, { Component } from 'react';

import styles from './Settings.css';

export default class Settings extends Component {
  constructor(props) {
    super(props);
  }

  renderLoginForm() {
    if (this.props.lastfmUsername === null) {
      var buttonText = this.props.lastfmConnected ? 'Log in' : 'Connect';
      var labelText = this.props.lastfmConnected ? 'Not logged in' : 'Not connected';

      return (
        <form onSubmit={this.props.lastfmLogin.bind(null)}>
          <div className={styles.settings_lastfm_label}><i style={{color: '#e74c3c'}} className="fa fa-times" /> {labelText}</div>
          <button className={`${styles.settings_form} btn btn-default`} type="submit">{buttonText}</button>
        </form>
      );
    } else {
      return (
        <div><i style={{color: '#2ecc71'}} className="fa fa-check" /> Logged in as {this.props.lastfmUsername}</div>
      )
    }
  }

  render() {
    return (
      <div className={styles.settings_container}>
        <h3><i style={{color: '#e74c3c'}} className="fa fa-lastfm-square" /> last.fm</h3>

        {this.renderLoginForm()}
      </div>
    );
  }
}
