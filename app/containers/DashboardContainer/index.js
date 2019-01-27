import React from 'react';
import { Tab } from 'semantic-ui-react';

import '../../../app/actions/player'
import BestNewMusicTab from './BestNewMusicTab';
import ChartsTab from './ChartsTab';
import GenresTab from './GenresTab';
import NewsTab from './NewsTab';
import { startPlayback } from '../../../app/actions/player';
import '../../../app/actions/queue';

class Dashboard extends React.Component {
  panes() {
    return [
      {
        menuItem: 'Best new music',
        render: () => (
          <BestNewMusicTab
            dashboardData={this.props.dashboardData}
            artistInfoSearchByName={this.props.artistInfoSearchByName}
            history={this.props.history}
          />
        )
      },
      {
        menuItem: 'Top Tracks',
        render: () => (
          <ChartsTab
            startPlayback = {startPlayback}
            clearQueue = {clearQueue}
            selectSong={selectSong}
            addToQueue={addToQueue}
            topTracks={this.props.dashboardData.topTracks}
            addToQueue={this.props.addToQueue}
            musicSources={this.props.musicSources}
          />
        )
      },
      {
        menuItem: 'Genres',
        render: () => (
          <GenresTab
            genres={this.props.dashboardData.topTags}
            history={this.props.history}
          />
        )
      },
      /* {
        menuItem: 'Events',
        render: () => {
          return null;
        },
      },*/
      {
        menuItem: 'News',
        render: () => <NewsTab news={this.props.dashboardData.news} />
      }
    ];
  }

  componentDidMount() {
    this.props.loadBestNewTracks();
    this.props.loadBestNewAlbums();
    this.props.loadNuclearNews();
    this.props.loadTopTags();
    this.props.loadTopTracks();
  }

  render() {
    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.panes()} />
      </div>
    );
  }
}

export default Dashboard;
