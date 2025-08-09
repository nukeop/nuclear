import { logger } from '../../';
import StreamProviderPlugin from '../streamProvider';
import { StreamQuery, StreamData } from '../plugins.types';

import YouTubeJSApi from '../../rest/YoutubeJS';

class YoutubeJSPlugin extends StreamProviderPlugin {

   api: YouTubeJSApi;

  
   constructor() {
     super();
     this.name = 'YoutubeJS Plugin';
     this.sourceName = 'youtubejs';
     this.description = 'A plugin allowing Nuclear to search for music and play it from Youtube using youtubei api through YoutubeJS';
     this.api = new YouTubeJSApi();
   }

   async search(query: StreamQuery): Promise<undefined | StreamData[]> {

     try {
       await this.api.init();
       return this.api.search(query.artist, query.track);
     } catch (error) {
       const terms = query.artist + ' ' + query.track;
       logger.error(`Error while searching for ${terms} with YoutubeJS`);
       logger.error(error);
     }
   }

   async getStreamForId(id: string): Promise<undefined | StreamData> {
     try {
       await this.api.init();
       return this.api.getTrack(id);
     } catch (error) {
       logger.error(`Error while searching id ${id} on YoutubeJS`);
       logger.error(error);
     }
   }
}

export default YoutubeJSPlugin;
