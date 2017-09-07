import React from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import Spacer from '../Spacer';
import AlbumList from '../AlbumList';
import ArtistTags from './ArtistTags';
import SimilarArtists from './SimilarArtists';
import PopularTracks from './PopularTracks';

import styles from './styles.scss';

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
    return (
      <div className={styles.artist_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={this.isLoading()}>
            <Loader/>
          </Dimmer>

            {this.isLoading()
              ? null
              : <div className={styles.artist}>
                <div style={{
                  background: `url('${this.props.artist.images[0].resource_url}')`,
                  backgroundRepeat: 'noRepeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }} className={styles.artist_header}>

                  <div className={styles.artist_header_overlay}>
                    <div className={styles.artist_header_container}>
                      <div className={styles.artist_avatar} style={{
                        background: `url('${this.props.artist.images[1].resource_url}')`,
                        backgroundRepeat: 'noRepeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}></div>
                      <div className={styles.artist_name_container}>
                        <h1>{this.props.artist.name}</h1>
                        <ArtistTags tags={this.props.artist.lastfm.artist.tags.tag}/>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
          }

          <hr />

          <div className={styles.artist_related_container}>
            {
              this.isLoading()
              ? null
              : <PopularTracks
                tracks={this.props.artist.lastfm.toptracks}
              />
            }

            {
              this.isLoading()
                ? null
                : <SimilarArtists
                  artists={this.props.artist.lastfm.artist.similar.artist}
                  artistInfoSearchByName={this.props.artistInfoSearchByName}
                  history={this.props.history}
                />
            }
          </div>

          <AlbumList
            albums={this.props.artist.releases}
            albumInfoSearch={this.props.albumInfoSearch}
            history={this.props.history}
          />
        </Dimmer.Dimmable>
      </div>
    )
  }
}
export default ArtistView;
