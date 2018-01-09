import React from 'react';
import { Tab } from 'semantic-ui-react';

import BestNewMusicTab from './BestNewMusicTab';

class Dashboard extends React.Component {
  panes() {
    return [
      {
	menuItem: 'Best new music',
	render: () => <BestNewMusicTab dashboardData={this.props.dashboardData} />
      },
      {
	menuItem: 'Genres',
	render: () => { return null; }
      },
      {
	menuItem: 'News',
	render: () => { return null; }
      },
    ];
  }

  componentDidMount() {
    this.props.loadBestNewTracks();
    this.props.loadBestNewAlbums();
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
