import React, { Component } from 'react';
import Settings from '../components/Settings';

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const globals = require('../api/Globals');
const lastfm = require('../api/Lastfm');
const settingsApi = require('../api/SettingsApi');

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

  componentWillMount() {
    this.loadSession();
  }

  setLastfmAuthTokenCallback(authToken) {
    this.setState({lastfmAuthToken: authToken});
  }

  setLastfmSession(session, username) {
    this.setState({lastfmSession: session, lastfmUsername: username});
    this.saveSession();
  }

  saveSession() {
    settingsApi.saveInSettings(lastfmSession, this.state.lastfmSession);
    settingsApi.saveInSettings(lastfmUsername, this.state.lastfmUsername);
  }

  loadSession() {
    this.setState({
      lastfmSession: settingsApi.loadFromSettings('lastfmSession'),
      lastfmUsername: settingsApi.loadFromSettings('lastfmUsername')
    });
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
