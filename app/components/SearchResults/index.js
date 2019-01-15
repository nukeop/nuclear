import React from 'react';
import { Tab } from 'semantic-ui-react';

import AllResults from './AllResults';
import Card from '../Card';

import styles from './styles.scss';

class SearchResults extends React.Component {
  renderAllResultsPane() {
    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          <AllResults
            artistSearchResults={this.props.artistSearchResults}
            albumSearchResults={this.props.albumSearchResults}
            trackSearchResults={this.props.trackSearchResults}
            albumInfoSearch={this.albumInfoSearch.bind(this)}
            artistInfoSearch={this.artistInfoSearch.bind(this)}
            addToQueue={this.props.addToQueue}
            musicSources={this.props.musicSources}
          />
        </div>
      </Tab.Pane>
    );
  }

  renderPane(collection, onClick) {
    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          {collection.length > 0
            ? this.props.unifiedSearchStarted
              ? null
              : collection.map((el, i) => {
                  let artist = null;
                  let title = el.title.split(' - ');
                  if (title.length > 1) {
                    artist = title[0];
                    title = title[1];
                  }
                  return (
                    <Card
                      header={title}
                      content={artist}
                      image={el.thumb}
                      onClick={() => onClick(el.id)}
                    />
                  );
                })
            : 'Nothing found.'}
        </div>
      </Tab.Pane>
    );
  }

  renderLastFmPane(collection) {
    let addToQueue = this.props.addToQueue;
    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          {collection.length > 0
            ? this.props.unifiedSearchStarted
              ? null
              : collection.map((el, i) => {
                  return (
                    <Card
                      small
                      header={el.name + ' - ' + el.artist}
                      image={el.image[2]['#text']}
                      onClick={() => {
                        addToQueue(this.props.musicSources, {
                          artist: el.name,
                          name: el.name,
                          thumbnail: el.image[1]['#text'],
                        });
                      }}
                      key={i}
                    />
                  );
                })
            : 'Nothing found.'}
        </div>
      </Tab.Pane>
    );
  }

  panes() {
    var panes = [
      {
        menuItem: 'All',
        render: () => this.renderAllResultsPane(),
      },
      {
        menuItem: 'Artists',
        render: () =>
          this.renderPane(
            this.props.artistSearchResults,
            this.artistInfoSearch.bind(this)
          ),
      },
      {
        menuItem: 'Albums',
        render: () =>
          this.renderPane(
            this.props.albumSearchResults,
            this.albumInfoSearch.bind(this)
          ),
      },
      {
        menuItem: 'Tracks',
        render: () => this.renderLastFmPane(this.props.trackSearchResults.info),
      },
    ];

    return panes;
  }

  albumInfoSearch(albumId) {
    this.props.albumInfoSearch(albumId);
    this.props.history.push('/album/' + albumId);
  }

  artistInfoSearch(artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  render() {
    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.panes()} />
      </div>
    );
  }
}

export default SearchResults;
