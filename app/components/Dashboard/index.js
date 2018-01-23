import React from 'react';
import { Tab } from 'semantic-ui-react';

import BestNewMusicTab from './BestNewMusicTab';
import GenresTab from './GenresTab';
import NewsTab from './NewsTab';

class Dashboard extends React.Component {
  panes() {
    return [
      {
	menuItem: 'Best new music',
	render: () => <BestNewMusicTab dashboardData={this.props.dashboardData} />
      },
      {
	menuItem: 'Charts',
	render: () => { return null; }
      },
      {
	menuItem: 'Genres',
	render: () => <GenresTab
	               genres={this.props.dashboardData.topTags}
	               history={this.props.history}
	              />
      },
      {
	menuItem: 'Events',
	render: () => { return null; }
      },
      {
	menuItem: 'News',
	render: () => <NewsTab news={this.props.dashboardData.news}/>
      },
    ];
  }

  componentDidMount() {
    this.props.loadBestNewTracks();
    this.props.loadBestNewAlbums();
    this.props.loadNuclearNews();
    this.props.loadTopTags();
  }
  
  render() {
    return (
      <div>
        <Tab menu={{secondary: true, pointing: true}} panes={this.panes()} />
      </div>
    );
  }
}

export default Dashboard;
