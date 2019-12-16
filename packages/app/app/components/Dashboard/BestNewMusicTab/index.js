import React from 'react';
import { Tab } from 'semantic-ui-react';
import _ from 'lodash';

import BestNewMusicMenu from './BestNewMusicMenu';
import BestNewMusicContent from './BestNewMusicContent';
import styles from './styles.scss';

class BestNewMusicTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.activeItem === null) {
      const firstAlbum = _.head(
        _.get(nextProps, 'dashboardData.bestNewAlbums')
      );

      if (firstAlbum) {
        this.setState({
          activeItem: firstAlbum
        });
      }
    }
  }

  isLoading () {
    return this.props.dashboardData.bestNewAlbums.length < 1 || this.props.dashboardData.bestNewTracks.length < 1;
  }

  setActiveItem(activeItem) {
    this.setState({ activeItem });
    document.getElementsByClassName('best_new_music_content')[0].scrollTo(0, 0);
  }

  render () {
    let {
      dashboardData,
      artistInfoSearchByName,
      albumInfoSearchByName,
      addToQueue,
      selectSong,
      clearQueue,
      startPlayback,
      streamProviders,
      history
    } = this.props;

    return (
      <Tab.Pane
        loading={this.isLoading()}
        attached={false}
        className={styles.best_new_music_tab_pane}
      >
        <BestNewMusicMenu
          albums={dashboardData.bestNewAlbums}
          tracks={dashboardData.bestNewTracks}
          setActiveItem={this.setActiveItem.bind(this)}
        />
        <BestNewMusicContent
          item={this.state.activeItem}
          artistInfoSearchByName={artistInfoSearchByName}
          albumInfoSearchByName={albumInfoSearchByName}
          addToQueue={addToQueue}
          selectSong={selectSong}
          clearQueue={clearQueue}
          startPlayback={startPlayback}
          streamProviders={streamProviders}
          history={history}
        />
      </Tab.Pane>
    );      
  }
}

export default BestNewMusicTab;
