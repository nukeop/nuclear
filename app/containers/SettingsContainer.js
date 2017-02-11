import React, { Component } from 'react';
import Settings from '../components/Settings';

const lastfm = require('../api/Lastfm');

export default class SettingsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastfmConnected: false,
      lastfmAuthToken: null,
      lastfmSession: null,
      lastfmUsername: null
    }
  }

  setLastfmAuthTokenCallback(authToken) {
    this.setState({lastfmAuthToken: authToken});
  }

  setLastfmSession(session, username) {
    this.setState({lastfmSession: session, lastfmUsername: username});
  }

  lastfmLogin(event, value) {
    if (!this.state.lastfmConnected) {
      lastfm.lastfmLoginConnect(this.setLastfmAuthTokenCallback.bind(this));
      this.setState({lastfmConnected: true});
    } else {
      lastfm.lastfmLogin(this.state.lastfmAuthToken, this.setLastfmSession.bind(this));
    }

    return false;
  }

  render() {
    return (
      <Settings
        lastfmLogin={this.lastfmLogin.bind(this)}
        lastfmConnected={this.state.lastfmConnected}
        lastfmUsername={this.state.lastfmUsername}
      />
    );
  }
}
