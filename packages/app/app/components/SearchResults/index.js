import React from 'react';
import { Tab } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { Card } from '@nuclear/ui';

import AllResults from './AllResults';
import TracksResults from './TracksResults';
import PlaylistResults from './PlaylistResults';

import styles from './styles.scss';

@withTranslation('search')
class SearchResults extends React.Component {
  renderAllResultsPane() {
    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          <div className={styles.row}>
            <AllResults
              {...this.props}
              albumInfoSearch={this.albumInfoSearch.bind(this)}
              artistInfoSearch={this.artistInfoSearch.bind(this)}
              podcastInfoSearch={this.podcastInfoSearch.bind(this)}
            />
          </div>
        </div>
      </Tab.Pane >
    );
  }

  renderPane(collection, onClick) {
    const selectedProvider = _.find(this.props.metaProviders, { sourceName: this.props.selectedPlugins.metaProviders });

    return (
      <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          {collection.length > 0
            ? this.props.unifiedSearchStarted
              ? null
              : collection.map((el, i) => {
                const id = _.get(el, `ids.${selectedProvider.searchName}`, el.id);
                return (
                  <Card
                    key={'title-card-' + i}
                    header={el.title || el.name}
                    content={el.artist}
                    image={
                      el.coverImage ||
                      el.thumb
                    }
                    onClick={() => onClick(id, el.type)}
                  />
                );
              })
            : this.props.t('empty')}
        </div>
      </Tab.Pane>
    );
  }

  renderTrackListPane(collection) {
    if (typeof collection !== 'undefined') {

      return (
        <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
          <div className={styles.pane_container}>
            {collection.length > 0
              ? this.props.unifiedSearchStarted
                ? null
                : <TracksResults tracks={collection} limit='15' />
              : this.props.t('empty')}
          </div>
        </Tab.Pane>
      );
    } else {
      return (
        <Tab.Pane loading={this.props.unifiedSearchStarted} attached={false}>
          <div className={styles.pane_container}>Nothing found.</div>
        </Tab.Pane>
      );
    }
  }

  renderPlaylistPane() {
    return (
      <Tab.Pane attached={false}>
        <PlaylistResults
          playlistSearchStarted={this.props.playlistSearchStarted}
          playlistSearchResults={this.props.playlistSearchResults}
          addToQueue={this.props.addToQueue}
          clearQueue={this.props.clearQueue}
          startPlayback={this.props.startPlayback}
          selectSong={this.props.selectSong}
          streamProviders={this.props.streamProviders}
        />
      </Tab.Pane>
    );
  }

  panes() {
    const panes = [
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
        render: () => this.renderTrackListPane(this.props.trackSearchResults.info)
      },
      {
        menuItem: 'Playlist',
        render: () => this.renderPlaylistPane()
      },
      {
        menuItem: 'LiveStream',
        render: () => this.renderTrackListPane(this.props.liveStreamSearchResults.info)
      },
      {
        menuItem: 'Podcast',
        render: () =>
          this.renderPane(
            this.props.podcastSearchResults,
            this.podcastInfoSearch.bind(this)
          )
      }
    ];

    return panes;
  }

  albumInfoSearch(albumId, releaseType, release) {
    this.props.albumInfoSearch(albumId, releaseType, release);
    this.props.history.push('/album/' + albumId);
  }

  artistInfoSearch(artistId) {
    this.props.artistInfoSearch(artistId);
    this.props.history.push('/artist/' + artistId);
  }

  podcastInfoSearch(podcastId, releaseType, release) {
    this.props.albumInfoSearch(podcastId, releaseType, release);
    this.props.history.push('/album/' + podcastId);
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
