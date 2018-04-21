import MusicSourcePlugin from '../musicSources';
import * as Soundcloud from '../../rest/Soundcloud';

class SoundcloudPlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
  }

  search(terms) {
    return Soundcloud.soundcloudSearch(terms)
    .then(data => data.json())
    .then(results => {
      let info = results[0];
      if (!info) {
        return null;
      }

      return {
        source: this.sourceName,
        id: info.id,
        stream: info.stream_url,
        duration: info.duration,
        title: info.title,
        thumbnail: info.user.avatar_url
      };
    })
    .catch(err => {
      console.error(`Error looking up streams for ${terms} on Soundcloud`);
      console.error(err);
    });
  }

  getAlternateStream(terms, currentStream) {

  }
}

export default SoundcloudPlugin;
