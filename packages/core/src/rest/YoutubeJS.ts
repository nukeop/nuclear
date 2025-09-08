import { YoutubeHeuristics } from './heuristics';
import { Innertube, UniversalCache, ClientType} from 'youtubei.js';
import { Video } from 'youtubei.js/dist/src/parser/nodes';
import { StreamData } from '../plugins/plugins.types';
import ytsr from '@distube/ytsr';


class YouTubeJSApi {
  private searchYT : Innertube;
  private downloadYT: Innertube;

  /*
  Fetch from the project and fetch expected by YoutubeJS are somehow different. So
  here is a method that makes this project's fetch adhere to YoutubeJS' expectations
  */
  private customFetch(input: any, init?: RequestInit): Promise<Response> {
    if ((input as any).href) {
      return fetch(input, init);
    }

    const params = Object.assign({}, init);
    for (const param of ['method', 'duplex', 'mode']) {
      if (input[param]) {
        params[param] = input[param];
      }
    }

    return fetch((input as Request).url, params);
  }

  private ytjsVideToYtdlVideo(video : Video) : Partial<ytsr.Video> {
    return {
      id: video.video_id,
      name: video.title.toString(),
      author: {
        name: video.author.name,
        channelID: video.author.id,
        url: video.author.url,
        bestAvatar: video.author.best_thumbnail,
        avatars: video.author.thumbnails,
        ownerBadges: [],
        verified: video.author.is_verified
      },
      duration: video.duration.seconds.toString()
    };
  }

  async init() {
    if (!this.searchYT) {
      this.searchYT = await Innertube.create({ fetch: this.customFetch as any, cache: new UniversalCache(false), generate_session_locally: true, client_type: ClientType.WEB});
    }
    if (!this.downloadYT) {
      this.downloadYT = await Innertube.create({ fetch: this.customFetch as any, cache: new UniversalCache(false), generate_session_locally: true, client_type: ClientType.ANDROID});
    }

  }

  async getTrack(id : string) : Promise<undefined | StreamData> {
    const data = await this.downloadYT.getBasicInfo(id);
    if (data) {
      return {
        source: 'youtubejs',
        id: data.basic_info.id,
        stream: data.streaming_data?.adaptive_formats.find(({ mime_type }) => mime_type.includes('audio') && mime_type.includes('webm')).url,
        duration: data.basic_info.duration,
        title: data.basic_info.title,
        thumbnail: data.basic_info.thumbnail[3]?.url,
        originalUrl: `https://www.youtube.com/watch?v=${data.basic_info.id}`
      };
    }
  }

  async search(artist : string, track: string) : Promise<undefined | StreamData[]>  {

    const terms = artist + ' ' + track;
    const searchResult = await this.searchYT.search(terms);
    const initialResult = searchResult.results.map(x => x as Video).filter(x => !!x.video_id).map(x => this.ytjsVideToYtdlVideo(x));

    const heuristics = new YoutubeHeuristics();
    const orderedTracks = heuristics.orderTracks({
      tracks: initialResult,
      artist,
      title: track
    });


    const promises = orderedTracks.map(track => this.getTrack(track.id));
    const results = await Promise.all(promises.map(p => p.catch(e => {
      return e;
    })));
    return results.filter(result => !(result instanceof Error));
  }

}

export default YouTubeJSApi;
