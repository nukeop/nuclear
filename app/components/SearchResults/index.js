import React from 'react';
import { Tab } from 'semantic-ui-react';

import Card from '../Card';

const panes = [
  {menuItem: 'All', render: () => <Tab.Pane attached={false}> All search results </Tab.Pane>},
  {menuItem: 'Artists', render: () => <Tab.Pane attached={false}> All artists </Tab.Pane>},
  {menuItem: 'Albums', render: () => <Tab.Pane attached={false}> <Card
    header="Joe's Garage"
    content='Frank Zappa'
    image='https://upload.wikimedia.org/wikipedia/en/9/9a/Zappa_Joe%27s_Garage.jpg'
  /> </Tab.Pane>}

];

class SearchResults extends React.Component {
  render() {
    return (
      <div>
        <Tab menu={{secondary: true, pointing: true}} panes={panes} />
      </div>
    );
  }
}

export default SearchResults;
