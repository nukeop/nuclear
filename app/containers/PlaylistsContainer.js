import React, { Component } from 'react';
import Playlists from '../components/Playlists';

const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const globals = require('../api/Globals');

export default class PlaylistsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };

    fs.readdir(
      path.join(
        globals.directories.userdata,
        globals.directories.playlists
      ),
      (err, items) => {
        items.map((item, i) => {
          var contents = jsonfile.readFileSync(
            path.join(
              globals.directories.userdata,
              globals.directories.playlists,
              item
            )
          );
          this.state.playlists.push({filename: item, contents: contents});
        });
      }
    )
  }


  render() {
    return(
      <Playlists
        playlists={this.state.playlists}
      />
    );
  }
}
