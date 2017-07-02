import React from 'react';
import { Tab } from 'semantic-ui-react';

import styles from './styles.css';
import sss from '../../app.global.scss';

import Card from '../../components/Card';


const panes = [
  {menuItem: 'All', render: () => <Tab.Pane attached={false}> All search results </Tab.Pane>},
  {menuItem: 'Artists', render: () => <Tab.Pane attached={false}> All artists </Tab.Pane>},
  {menuItem: 'Albums', render: () => <Tab.Pane attached={false}> All albums </Tab.Pane>}

];

class MainLayout extends React.Component {
  render() {
    return (
      <div className={styles.main_layout_container + ' ' + this.props.className}>
        {this.props.children}

        <Tab menu={{secondary: true, pointing: true}} panes={panes} />

        <Card
          header="Joe's Garage"
          content='Frank Zappa'
          image='https://upload.wikimedia.org/wikipedia/en/9/9a/Zappa_Joe%27s_Garage.jpg'
        />
      </div>
    );
  }
}

export default MainLayout;
