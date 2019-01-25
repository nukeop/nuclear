import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import TagDescription from './TagDescription';
import TagHeader from './TagHeader';
import TagTopList from './TagTopList';
import TagTopTracks from './TagTopTracks';
import styles from './styles.scss';

class TagView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadTagInfo(this.props.tag);
  }

  artistInfoSearchByName(artistName) {
    this.props.artistInfoSearchByName(artistName, this.props.history);
  }

  albumInfoSearchByName(albumName) {
    this.props.albumInfoSearchByName(albumName, this.props.history);
  }

  renderTagHeader(tagInfo, topArtists) {
    let { tag } = this.props;
    return <TagHeader tag={tag} tagInfo={tagInfo} topArtists={topArtists} />;
  }

  renderTopArtists(topArtists) {
    return (
      <TagTopList
        topList={topArtists}
        onClick={this.artistInfoSearchByName.bind(this)}
        header='Top Artists'
      />
    );
  }

  renderTopAlbums(topAlbums) {
    return (
      <TagTopList
        topList={topAlbums}
        onClick={this.albumInfoSearchByName.bind(this)}
        header='Top Albums'
      />
    );
  }

  renderTagTopTracks(topTracks, addToQueue, musicSources) {
    return (
      <TagTopTracks
        tracks={topTracks}
        addToQueue={addToQueue}
        musicSources={musicSources}
      />
    );
  }
  renderTopArtistsAndTopAlbums(topArtists, topAlbums) {
    return (
      <div className={styles.lists_container}>
        {this.renderTopArtists(topArtists)}
        {this.renderTopAlbums(topAlbums)}
      </div>
    );
  }

  renderDimmer() {
    let { tag, tags } = this.props;
    return (
      <Dimmer active={tags[tag] === undefined || tags[tag].loading}>
        <Loader />
      </Dimmer>
    );
  }

  render() {
    let { addToQueue, tag, tags, musicSources } = this.props;
    let tagInfo, topTracks, topAlbums, topArtists;
    if (tags[tag] && tags[tag].loading !== true) {
      tagInfo = tags[tag][0].tag;
      topTracks = tags[tag][1].tracks.track;
      topAlbums = tags[tag][2].albums.album;
      topArtists = tags[tag][3].topartists.artist;
    }
    return (
      <div className={styles.tag_view_container}>
        <Dimmer.Dimmable>
          {this.renderDimmer()}
          {tags[tag] === undefined || tags[tag].loading ? null : (
            <div className={styles.tag_view}>
              {this.renderTagHeader(tagInfo, topArtists)}
              <TagDescription tagInfo={tagInfo} />
              {this.renderTopArtistsAndTopAlbums(topArtists, topAlbums)}
              {this.renderTagTopTracks(topTracks, addToQueue, musicSources)}
            </div>
          )}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default TagView;
