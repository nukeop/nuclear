import React from 'react';
import { Tab } from 'semantic-ui-react';

import Card from '../Card';

import styles from './styles.scss';

class SearchResults extends React.Component {

  renderPane(collection) {
    return (
      <Tab.Pane attached={false}>
        <div className={styles.pane_container}>
        {
          collection.map((el, i) => {
            return (
              <Card
                header={el.title}
                image={el.thumb}
              />
            )
          })
        }
        </div>
      </Tab.Pane>
    );
  }

  panes() {
    var panes = [
      {
        menuItem: 'Artists',
        render: () => this.renderPane(this.props.artistSearchResults)
      },
      {
        menuItem: 'Albums',
        render: () => this.renderPane(this.props.albumSearchResults)
      }
    ];

    return panes;
  }

  render() {
    return (
      <div>
        <Tab menu={{secondary: true, pointing: true}} panes={this.panes()} />
      </div>
    );
  }
}

export default SearchResults;
