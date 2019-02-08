import React from 'react';
import { Tab } from 'semantic-ui-react';

import AllResults from './AllResults';
import TracksResults from './TracksResults';
import PlaylistResults from './PlaylistResults';
import Card from '../Card';

import styles from './styles.scss';

class SearchResults extends React.Component {
  renderAllResultsPane () {
    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          <div className={styles.row}>
            <AllResults
              artistSearchResults={this.props.artistSearchResults}
              albumSearchResults={this.props.albumSearchResults}
              trackSearchResults={this.props.trackSearchResults}
              playlistSearchResults={this.props.playlistSearchResults}
              playlistSearchStarted={this.props.playlistSearchStarted}
              albumInfoSearch={this.albumInfoSearch.bind(this)}
              artistInfoSearch={this.artistInfoSearch.bind(this)}
              addToQueue={this.props.addToQueue}
              musicSources={this.props.musicSources}
              clearQueue={this.props.clearQueue}
              startPlayback={this.props.startPlayback}
              selectSong={this.props.selectSong}
            />
          </div>
        </div>
      </Tab.Pane >
    );
  }

  renderPane (collection, onClick) {
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
                    key={'title-card-' + i}
                    header={title}
                    content={artist}
                    image={el.thumb}
                    onClick={() => onClick(el.id, el.type)}
                  />
                );
              })
            : 'Nothing found.'}
        </div>
      </Tab.Pane>
    );
  }

  renderLastFmPane (collection) {
    if (typeof collection !== 'undefined') {

      return (
        <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
          <div className={styles.pane_container}>
            {collection.length > 0
              ? this.props.unifiedSearchStarted
                ? null
                : <TracksResults
                  clearQueue={this.props.clearQueue}
                  addToQueue={this.props.addToQueue}
                  startPlayback={this.props.startPlayback}
                  selectSong={this.props.selectSong}
                  tracks={collection}
                  limit='15'
                />
              : 'Nothing found.'}
          </div>
        </Tab.Pane>
      );
    } else {
      return (
        <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
          <div className={styles.pane_container}>No result</div>
        </Tab.Pane>
      );
    }
  }


  renderPlaylistPane () {
    return (<PlaylistResults
      playlistSearchStarted={this.props.playlistSearchStarted}
      playlistSearchResults={this.props.playlistSearchResults}
      addToQueue={this.props.addToQueue}
      clearQueue={this.props.clearQueue}
      startPlayback={this.props.startPlayback}
      selectSong={this.props.selectSong}
      musicSources={this.props.musicSources}
    />);
  }

  panes () {
    let panes = [
      {
        menuItem: 'All',
        render: () => this.renderAllResultsPane()
      },
      {
        menuItem: 'Artists',
        render: () =>
          this.renderPane(
            this.props.artistSearchResults,
            this.artistInfoSearch.bind(this)
          )
      },
      {
        menuItem: 'Albums',
        render: () =>
          this.renderPane(
            this.props.albumSearchResults,
            this.albumInfoSearch.bind(this)
          )
      },
      {
        menuItem: 'Tracks',
        render: () => this.renderLastFmPane(this.props.trackSearchResults.info)
      },
      {
        menuItem: 'Playlist',
        render: () => this.renderPlaylistPane(this.props.playlistSearchResults)
      }
    ];

    return panes;
  }

  albumInfoSearch (albumId, releaseType) {
    this.props.albumInfoSearch(albumId, releaseType);
    this.props.history.push('/album/' + albumId);
  }

  artistInfoSearch (artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  render () {
    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.panes()} />
      </div>
    );
  }
}

export default SearchResults;
