import MusicSourcePlugin from '../musicSources';
import * as Youtube from '../../rest/Youtube';

const _ = require('lodash');
const ytdl = require('ytdl-core');

class YoutubePlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.sourceName = 'Youtube';
    this.description = 'A plugin allowing nuclear to search for music and play it from youtube';
  }

  search(terms) {
    return Youtube.trackSearch(terms)
    .then(results => results.json())
    .then(results => {
      let song = _.head(results.items);
      let id = song.id.videoId;
      return ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
    })
    .then(videoInfo => {
      let formatInfo = _.head(videoInfo.formats.filter(e => e.itag=='140'));
      return {
	source: 'Youtube',
	id: videoInfo.video_id,
	stream: formatInfo.url,
	duration: videoInfo.length_seconds,
	title: videoInfo.title,
	thumbnail: videoInfo.thumbnail_url
      };
    });
  }
}

export default YoutubePlugin;
