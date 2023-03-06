import React from 'react';
import { Tab } from 'semantic-ui-react';
import { DashboardReducerState } from '../../../reducers/dashboard';
import _ from 'lodash';
import {History} from 'history';
import BestNewMusicMenu from './BestNewMusicMenu';
import BestNewMusicContent from './BestNewMusicContent';
import styles from './styles.scss';
import { PitchforkAlbum, PitchforkTrack } from '../../../actions/dashboard';

type BestNewMusicContentProps = {
  dashboardData: DashboardReducerState;
  artistInfoSearchByName: (artistName: string, history: History) => void;
    albumInfoSearchByName:(albumName: string, artistName: string, history: History) => void;
    history:History;
}

export type MusicContentTrackAndAlbum = PitchforkAlbum & PitchforkTrack

type BestNewMusicContentState = {
  activeItem: MusicContentTrackAndAlbum;
}

class BestNewMusicTab extends React.Component <BestNewMusicContentProps, BestNewMusicContentState> {

    state: BestNewMusicContentState = {
      activeItem: null
    };

    componentDidMount() {
      if (this.state.activeItem === null) {
        const firstAlbum = _.head(this.props.dashboardData.bestNewAlbums);

        if (firstAlbum) {
          this.setActiveItem(firstAlbum);
        }
      }
    }

    isLoading() {
      return (this.props.dashboardData.bestNewAlbums && this.props.dashboardData.bestNewTracks) ? this.props.dashboardData.bestNewAlbums.length < 1 || this.props.dashboardData.bestNewTracks.length < 1 : true;
    }

    setActiveItem(activeItem: MusicContentTrackAndAlbum) {
      this.setState({ activeItem });
    }

    render() {
      const {
        dashboardData,
        artistInfoSearchByName,
        albumInfoSearchByName,
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
            history={history}
          />
        </Tab.Pane>
      );
    }
}

export default BestNewMusicTab;
