import React from 'react';
import _ from 'lodash';
import { Card } from '@nuclear/ui';

import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import PlaylistResults from '../PlaylistResults';
import TracksResults from '../TracksResults';

import styles from './styles.scss';
import { withTranslation } from 'react-i18next';

@withTranslation('search')
class AllResults extends React.Component {
  constructor(props) {
    super(props);
  }
  renderResults(collection, onClick) {
    const selectedProvider = _.find(this.props.metaProviders, { sourceName: this.props.selectedPlugins.metaProviders });

    return collection.slice(0, 5).map((el, i) => {
      const id = _.get(el, `ids.${selectedProvider.searchName}`, el.id);

      return (
        <Card
          small
          header={el.title || el.name}
          image={
            el.coverImage ||
            el.thumb ||
            el.thumbnail ||
            artPlaceholder
          }
          content={el.artist}
          onClick={() => onClick(id, el.type, el)}
          key={'item-' + i}
        />
      );
    });
  }

  renderTracks(arr = [], limit = 5) {
    return (<TracksResults
      clearQueue={this.props.clearQueue}
      addToQueue={this.props.addToQueue}
      startPlayback={this.props.startPlayback}
      selectSong={this.props.selectSong}
      tracks={arr}
      limit={limit}
      streamProviders={this.props.streamProviders}
    />);

  }

  renderPlaylistSection = () =>
    <div className={styles.column}>
      <h3>{this.props.t('playlist', { count: this.props.playlistSearchResults.length })}</h3>
      <div className={styles.row}>
        <PlaylistResults
          playlistSearchStarted={this.props.playlistSearchStarted}
          playlistSearchResults={this.props.playlistSearchResults}
          addToQueue={this.props.addToQueue}
          clearQueue={this.props.clearQueue}
          startPlayback={this.props.startPlayback}
          selectSong={this.props.selectSong}
          streamProviders={this.props.streamProviders}
        />
      </div>
    </div>

  renderSection(title, collection, onClick) {
    return (<div className={styles.column}>
      <h3>{title}</h3>
      <div className={styles.row}>
        {this.renderResults(
          collection,
          onClick
        )}
      </div>
    </div>);
  }

  renderArtistsSection() {
    const { t, artistSearchResults, artistInfoSearch } = this.props;

    return this.renderSection(t('artist', { count: artistSearchResults.length }), artistSearchResults, artistInfoSearch);
  }

  renderAlbumsSection() {
    const { t, albumSearchResults, albumInfoSearch } = this.props;

    return this.renderSection(t('album', { count: albumSearchResults.length }), albumSearchResults, albumInfoSearch);
  }

  renderTracksSection() {
    return (<div className={styles.column}>
      <h3>{this.props.t('track_plural')}</h3>
      <div className={styles.row}>
        {this.renderTracks(this.props.trackSearchResults.info)}
      </div>
    </div>);
  }

  render() {
    const tracksLength = _.get(this.props.trackSearchResults, ['info', 'length'], 0);
    const artistsLength = _.get(this.props.artistSearchResults, ['length'], 0);
    const albumsLength = _.get(this.props.albumSearchResults, ['length'], 0);
    const playlistsLength = _.get(this.props.playlistSearchResults, ['info', 'length'], 0);
    if (tracksLength + artistsLength + albumsLength + playlistsLength === 0) {
      return <div>{this.props.t('empty')}</div>;
    }

    return (
      <div className={styles.all_results_container}>
        {artistsLength > 0 && this.renderArtistsSection()}
        {albumsLength > 0 && this.renderAlbumsSection()}
        {tracksLength > 0 && this.renderTracksSection()}
        {playlistsLength > 0 && this.renderPlaylistSection()}
      </div>
    );
  }
}

export default AllResults;
