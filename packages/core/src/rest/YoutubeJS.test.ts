const innertubeMock = {create: null};

jest.mock('youtubei.js', () => {
  const originalModule = jest.requireActual('youtubei.js');

  // Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    Innertube: innertubeMock
  };
});

import YouTubeJSApi from './YoutubeJS';

describe('YoutubeJS tests', () => {
  it('multiple inits should not recreate connections', async () => {

    const createMock = jest.fn(() => {
      return {name: 'testObject'};
    });
    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();
    expect(createMock).toBeCalledTimes(2);
    await youTubeJSApi.init();
    expect(createMock).toBeCalledTimes(2);// No additional calls where made
  });

  it('getTrack returning value', async () => {

    const createMock = jest.fn(() => {
      return {
        getBasicInfo: (id) => {
          return {
            basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
            streaming_data: {adaptive_formats: [{mime_type: 'audio/webm', url: 'teststreamurl'}]}
          };
        }
      };
    });

    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    const videoId = 'testid';
    const data = await youTubeJSApi.getTrack(videoId);

    expect(data.source).toBe('youtubejs');
    expect(data.id).toBe(videoId);
    expect(data.stream).toBe('teststreamurl');
    expect(data.duration).toBe('433');
    expect(data.title).toBe('testvideotitle');
    expect(data.thumbnail).toBe('url3');
    expect(data.originalUrl).toBe(`https://www.youtube.com/watch?v=${videoId}`);
  });

  it('getTrack failing to return value', async () => {

    const createMock = jest.fn(() => {
      return {
        getBasicInfo: (id) => { }
      };
    });

    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    const videoId = 'testid';
    const data = await youTubeJSApi.getTrack(videoId);

    expect(data).toBeUndefined();
  });

  it('search tracks with some missing ids', async () => {

    const mockedSearch = jest.fn((name) => {
      return {results: [
        {video_id: 'vid1', title: 'title1', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid2', title: 'title2', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: null, title: 'title3', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid4', title: 'title4', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}}
      ]};
    });

    const createMock = jest.fn(() => {
      return {
        getBasicInfo: (id) => {
          return {
            basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
            streaming_data: {adaptive_formats: [{mime_type: 'audio/webm', url: 'teststreamurl'}]}
          };
        },
        search: mockedSearch
      };
    });

    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    const searchResult = await youTubeJSApi.search('author', 'title');

    expect(mockedSearch).toBeCalledWith('author title');
    expect(searchResult.length).toBe(3);

    const videoids = ['vid1', 'vid2', 'vid4'];
    for (const dataIndex in searchResult) {
      expect(searchResult[dataIndex].source).toBe('youtubejs');
      expect(searchResult[dataIndex].id).toBe(videoids[dataIndex]);
      expect(searchResult[dataIndex].stream).toBe('teststreamurl');
      expect(searchResult[dataIndex].duration).toBe('433');
      expect(searchResult[dataIndex].title).toBe('testvideotitle');
      expect(searchResult[dataIndex].thumbnail).toBe('url3');
      expect(searchResult[dataIndex].originalUrl).toBe(`https://www.youtube.com/watch?v=${videoids[dataIndex]}`);
    }

  });

  it('search tracks with ids without fitting streams', async () => {

    const mockedSearch = jest.fn((name) => {
      return {results: [
        {video_id: 'vid1', title: 'title1', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid2', title: 'title2', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid3', title: 'title3', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid4', title: 'title4', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid5', title: 'title5', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid6', title: 'title6', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid7', title: 'title7', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid8', title: 'title8', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid9', title: 'title9', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}}
      ]};
    });

    const createMock = jest.fn(() => {
      return {
        getBasicInfo: (id) => {

          switch (id) {
          case 'vid2' : {  
            return { // Fitting stream exists, but Youtube won't give it to us. Passing it along is allowed by StreamData interface
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
              streaming_data: {adaptive_formats: [{mime_type: 'audio/webm'}]}
            };
          }
          case 'vid3' : {
            return { // No fitting stream at all
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
              streaming_data: {adaptive_formats: [{mime_type: 'video/mp4', url: 'teststreamurl'}]}
            };
          }

          case 'vid5' : {
            return { // mime type is right but wrong codec
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
              streaming_data: {adaptive_formats: [{mime_type: 'audio/opus', url: 'teststreamurl'}]}
            };
          }

          case 'vid6' : {
            return { // codec is wright but bad type
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
              streaming_data: {adaptive_formats: [{mime_type: 'video/webm', url: 'teststreamurl'}]}
            };
          }

          case 'vid7' : {
            return { // no streams at all
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
              streaming_data: {}
            };
          }

          case 'vid8' : {
            return { // Stream exists but no thumbnails
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: []},
              streaming_data: {adaptive_formats: [{mime_type: 'audio/webm', url: 'teststreamurl'}]}
            };
          }
          case 'vid9' : {
            return { // no streams at all
              basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]}
            };
          }
          }

        
          return {
            basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
            streaming_data: {adaptive_formats: [{mime_type: 'audio/webm', url: 'teststreamurl'}]}
          };
        },
        search: mockedSearch
      };
    });

    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    const searchResult = await youTubeJSApi.search('author', 'title');

    expect(mockedSearch).toBeCalledWith('author title');

    expect(searchResult.length).toBe(5);

    const videoids = ['vid1', 'vid2', 'vid4', 'vid8', 'vid9'];
    for (const dataIndex in searchResult) {
      expect(searchResult[dataIndex].source).toBe('youtubejs');
      expect(searchResult[dataIndex].id).toBe(videoids[dataIndex]);

      if (['vid2', 'vid9'].includes(videoids[dataIndex])) {
        expect(searchResult[dataIndex].stream).toBeUndefined();
      } else {
        expect(searchResult[dataIndex].stream).toBe('teststreamurl');
      }

      expect(searchResult[dataIndex].duration).toBe('433');
      expect(searchResult[dataIndex].title).toBe('testvideotitle');

      if (['vid8'].includes(videoids[dataIndex])) {
        expect(searchResult[dataIndex].thumbnail).toBeUndefined();
      } else {
        expect(searchResult[dataIndex].thumbnail).toBe('url3');
      }

      expect(searchResult[dataIndex].originalUrl).toBe(`https://www.youtube.com/watch?v=${videoids[dataIndex]}`);
    }

  });

  it('search tracks but some vids fail to be fetched', async () => {

    const mockedSearch = jest.fn((name) => {
      return {results: [
        {video_id: 'vid1', title: 'title1', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}},
        {video_id: 'vid2', title: 'title2', duration: {seconds: '433'}, author: {name: 'author', id: 'authorid', url: 'authorurl', best_thumbnail: 'bestThumbnail', thumbnails: [], is_verified: true}}
      ]};
    });

    const createMock = jest.fn(() => {
      return {
        getBasicInfo: (id) => {
          if (id === 'vid2') {
            throw Error('vid2 not accessable');
          }
          
          return {
            basic_info: {id, duration: '433', title: 'testvideotitle', thumbnail: [{url: 'url0'}, {url: 'url1'}, {url: 'url2'}, {url: 'url3'}, {url: 'url4'}]},
            streaming_data: {adaptive_formats: [{mime_type: 'audio/webm', url: 'teststreamurl'}]}
          };
        },
        search: mockedSearch
      };
    });

    innertubeMock.create = createMock;

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    const searchResult = await youTubeJSApi.search('author', 'title');

    expect(mockedSearch).toBeCalledWith('author title');
    expect(searchResult.length).toBe(1);

    const videoids = ['vid1'];
    for (const dataIndex in searchResult) {
      expect(searchResult[dataIndex].source).toBe('youtubejs');
      expect(searchResult[dataIndex].id).toBe(videoids[dataIndex]);
      expect(searchResult[dataIndex].stream).toBe('teststreamurl');
      expect(searchResult[dataIndex].duration).toBe('433');
      expect(searchResult[dataIndex].title).toBe('testvideotitle');
      expect(searchResult[dataIndex].thumbnail).toBe('url3');
      expect(searchResult[dataIndex].originalUrl).toBe(`https://www.youtube.com/watch?v=${videoids[dataIndex]}`);
    }

  });

  it('custom fetch with url', async () => {

    let customfetch = null;
   

    innertubeMock.create = ({fetch}) => {
      customfetch = fetch; return {};
    };

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    global.fetch = jest.fn((input : any, requestInfo : any) => Promise.resolve({} as any));

    await customfetch({href: 'https://www.example.com/'}, {passthrough: 1});

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith({href: 'https://www.example.com/'}, {passthrough: 1});


  });

  it('custom fetch complex post', async () => {

    let customfetch = null;
   

    innertubeMock.create = ({fetch}) => {
      customfetch = fetch; return {};
    };

    const youTubeJSApi = new YouTubeJSApi();

    await youTubeJSApi.init();

    global.fetch = jest.fn((input : any, requestInfo : any) => Promise.resolve({} as any));

    await customfetch({url: 'https://www.example.com/', method: 'POST', duplex: 'half', mode: 'no-cors'}, {headers: ['header1', 'header2']});

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith('https://www.example.com/', {method: 'POST', duplex: 'half', mode: 'no-cors', headers: ['header1', 'header2']});


  });

});
