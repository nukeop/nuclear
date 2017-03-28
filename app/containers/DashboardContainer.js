import React, { Component } from 'react';

import Dashboard from '../components/Dashboard';

const p4k = require('../api/Pitchfork');

export default class DashboardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bestNewAlbums: null
    };
  }

  componentDidMount() {
    p4k.getBestNewAlbums((result) => {
      this.setState({bestNewAlbums: result});
    });
  }

  render() {
    return (
      this.state.bestNewAlbums===null
      ? <div style={{lineHeight: '750px', height: '100%', width: '100%', fontSize: '48px'}}><i className='fa fa-spinner fa-pulse fa-fw' /></div>
      : <Dashboard
          bestNewAlbums={this.state.bestNewAlbums}
          switchToArtistView={this.props.switchToArtistView}
        />
    );
  }

}
