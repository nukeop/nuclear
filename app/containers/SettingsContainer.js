import React, { Component } from 'react';
import Settings from '../components/Settings';

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const globals = require('../api/Globals');
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
    var filename = path.join(
      globals.directories.userdata,
      globals.directories.settings,
      globals.files.settings
    );

    if (fs.existsSync(filename)) {

      var settings = jsonfile.readFileSync(filename);

      settings.lastfmSession = this.state.lastfmSession;

      jsonfile.writeFile(filename, settings, (err) => {
        console.error(err);
      });

    } else {
      jsonfile.writeFile(
        filename,
        {
          lastfmSession: this.state.lastfmSession,
          lastfmUsername: this.state.lastfmUsername
        },
        (err) => {
        console.error(err);
      });
    }
  }

  loadSession() {
    var filename = path.join(
      globals.directories.userdata,
      globals.directories.settings,
      globals.files.settings
    );

    if (fs.existsSync(filename)) {
      var settings = jsonfile.readFileSync(filename);

      this.setState({
        lastfmSession: settings.lastfmSession,
        lastfmUsername: settings.lastfmUsername
      });
    }
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
