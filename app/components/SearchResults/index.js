import React from 'react';
import { Tab } from 'semantic-ui-react';

import Card from '../Card';

import styles from './styles.scss';

class SearchResults extends React.Component {
  panes() {
    var panes = [];

    var artistPane = {
      menuItem: 'Artists',
      render: () => {
        return (
          <Tab.Pane attached={false}>
            <div className={styles.artist_search_results_container}>
            {
              this.props.artistSearchResults.map((el, i) => {
                return (
                  <Card
                    header={el.title}
                    image={el.thumb}
                  />
                );
              })
            }
            </div>
          </Tab.Pane>
        );
      }
    }
    panes.push(artistPane);

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
