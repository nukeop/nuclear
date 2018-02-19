import React from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import Spacer from '../Spacer';
import AlbumList from '../AlbumList';
import ArtistTags from './ArtistTags';
import SimilarArtists from './SimilarArtists';
import PopularTracks from './PopularTracks';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

class ArtistView extends React.Component {
  constructor(props) {
    super(props);
    this.isLoading = this.isLoading.bind(this);
  }

  isLoading() {
    return this.props.artist.loading ||
           !this.props.artist.lastfm ||
           this.props.artist.lastfm.loading;
  }

  render() {
    let {
      artist,
      history,
      albumInfoSearch,
      addToQueue,
      selectSong,
      startPlayback,
      clearQueue,
      artistInfoSearchByName,
      musicSources
    } = this.props;
    return (
      <div className={styles.artist_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={this.isLoading()}>
            <Loader/>
          </Dimmer>

          {
            !this.isLoading() &&
            <div className={styles.artist}>
              <div
                style={{
                  background: `url('${artist.images[0] ? artist.images[0].resource_url : artPlaceholder}')`,
                  backgroundRepeat: 'noRepeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
                className={styles.artist_header}>

              <div className={styles.artist_header_overlay}>
                <div className={styles.artist_header_container}>
                  <div
                    className={styles.artist_avatar}
                    style={{
                      background: `url('${artist.images[1] ? artist.images[1].resource_url : artPlaceholder}')`,
                      backgroundRepeat: 'noRepeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover'
                    }}></div>
                  <div className={styles.artist_name_container}>
                    <h1>{artist.name}</h1>
                    <ArtistTags tags={artist.lastfm.artist.tags.tag}/>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }
        <hr />
        <div className={styles.artist_related_container}>
            {
              !this.isLoading() &&
              <PopularTracks
                tracks={artist.lastfm.toptracks}
                artist={artist}
                addToQueue={addToQueue}
                selectSong={selectSong}
                startPlayback={startPlayback}
                clearQueue={clearQueue}
                musicSources={musicSources}
              />
            }

            {
              !this.isLoading() &&
              <SimilarArtists
                artists={artist.lastfm.artist.similar.artist}
                artistInfoSearchByName={artistInfoSearchByName}
                history={history}
              />
            }
          </div>
          <hr />
          <AlbumList
            albums={artist.releases}
            albumInfoSearch={albumInfoSearch}
            history={history}
          />
        </Dimmer.Dimmable>
      </div>
    )
  }
}
export default ArtistView;
