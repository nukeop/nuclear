import React from 'react';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import AlbumList from '../AlbumList';
import ArtistTags from './ArtistTags';
import SimilarArtists from './SimilarArtists';
import PopularTracks from './PopularTracks';

import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

@withTranslation('artist')
class ArtistView extends React.Component {
  constructor(props) {
    super(props);
    this.isLoading = this.isLoading.bind(this);
  }

  isLoading () {
    return (
      _.get(this.props, 'artist.loading') ||
      _.isEmpty(_.get(this.props, 'artist.lastfm')) ||
      _.get(this.props, 'artist.lastfm.loading')
    );
  }

  isOnTour() {
    return _.get(this.props, 'artist.lastfm.artist.ontour') === '1';
  }

  renderArtistHeader (artist, history) {
    return (
      <div className={styles.artist_header_overlay}>
        <div className={styles.artist_header_container}>
          <div
            className={styles.artist_avatar}
            style={{
              background: `url('${
                _.get(artist, 'images[1].resource_url', artPlaceholder)
              }')`,
              backgroundRepeat: 'noRepeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          />

          <div className={styles.artist_name_container}>
            <div className={styles.artist_name_line}>
              <h1>{artist.name}</h1>
              {
                this.isOnTour() &&
                  <span
                    className={styles.on_tour}
                  >
                    {this.props.t('tour')}
                  </span>
              }
            </div>
            
            <ArtistTags
              tags={_.get(artist, 'lastfm.artist.tags.tag')}
              history={history}
            />
          </div>
        </div>
      </div>
    );
  }

  renderPopularTracks () {
    let {
      artist,
      addToQueue,
      musicSources
    } = this.props;
    
    return (
      !this.isLoading() &&
      artist.lastfm.toptracks && (
        <PopularTracks
          tracks={_.get(artist, 'lastfm.toptracks')}
          artist={artist}
          addToQueue={addToQueue}
          musicSources={musicSources}
        />
      )
    );
  }

  renderSimilarArtists () {
    let { artist, history, artistInfoSearchByName } = this.props;

    return (
      !this.isLoading() &&
        <SimilarArtists
          artists={_.get(artist, 'lastfm.artist.similar.artist', [])}
          artistInfoSearchByName={artistInfoSearchByName}
          history={history}
        />
    );
  }

  renderHeaderBanner () {
    let { artist, history } = this.props;

    return (
      <div
        style={{
          background: `url('${
            _.get(artist, 'images[0].resource_url', artPlaceholder)
          }')`,
          backgroundRepeat: 'noRepeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className={styles.artist_header}
      >
        {this.renderArtistHeader(artist, history)}
      </div>
    );
  }

  render () {
    let { artist, history, albumInfoSearch } = this.props;
    
    return (
      <div className={styles.artist_view_container}>
        <Dimmer.Dimmable>
          <Dimmer active={this.isLoading()}>
            <Loader />
          </Dimmer>

          {!this.isLoading() && (
            <div className={styles.artist}>{this.renderHeaderBanner()}</div>
          )}

          <hr />
          <div className={styles.artist_related_container}>
            {this.renderPopularTracks()}

            {this.renderSimilarArtists()}
          </div>
          <hr />
          <AlbumList
            albums={_.get(artist, 'releases', []).sort((a, b) => {
              return b.year - a.year;
            })}
            albumInfoSearch={albumInfoSearch}
            history={history}
          />
        </Dimmer.Dimmable>
      </div>
    );
  }
}
export default ArtistView;
