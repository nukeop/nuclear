import React from 'react';

import NowPlayingWithMenu from '../components/nowplaying.component';

class NowPlayingContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <NowPlayingWithMenu
      queue={this.props.queue}
      loading={this.props.loading}
      currentSong={this.props.currentSong}
      clearQueueCallback={this.props.clearQueueCallback}
        />
    );
  }
}

export default NowPlayingContainer;
