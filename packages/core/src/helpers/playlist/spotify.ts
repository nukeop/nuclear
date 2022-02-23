
type Track = {
  index: number;
  id?: string;
  thumbnail: string;
  title: string;
  album: string;
  duration: string;
  artist: string;
  otherArtists?: string[];
}

type Playlist = {
  name: string,
  numberOfTrack: number,
  source: string,
  tracks: Track[]
}

import { ipcRenderer } from 'electron';

export default (async function () {

  function getPlaylistGeneralInfo() {
    const tracklistContainer = document.querySelector('div[data-testid="playlist-tracklist"]');
    const numberOfTrack = parseInt(
      tracklistContainer.getAttribute('aria-rowcount')
    );
    const playlistName = tracklistContainer.getAttribute('aria-label');

    return {
      name: playlistName,
      numberOfTrack,
      tracks: [],
      source: 'Spotify'
    };
  }


  function getScrollBar() {
    const scrollBar = document.querySelector(
      'div.os-scrollbar:nth-child(4) > div:nth-child(1) > div:nth-child(1)'
    );
    const scrollBarBoundingBox = scrollBar.getBoundingClientRect();

    return scrollBarBoundingBox;
  }

  function getTracksFromDOM(processedIndex) {

    const nodeTracks: any = document.querySelector('div[data-testid="top-sentinel"] + div').childNodes;
    const tracks = [];

    for (let i = 0; i < nodeTracks.length; i += 1) {
      if (nodeTracks[i]) {
        const index = parseInt(nodeTracks[i].getAttribute('aria-rowindex'));

        if (index > processedIndex) {
          const nodeDetails = nodeTracks[i].childNodes[0];
          const track: Track = {
            index: 0,
            thumbnail: '',
            title: '',
            album: '',
            duration: '',
            artist: ''
          };
          track.index = index;
          track.thumbnail = nodeDetails
            .querySelector('div[aria-colindex="2"]')
            .querySelector('img')
            .getAttribute('src');

          const titleAndArtist = nodeDetails
            .querySelector('div[aria-colindex="2"]')
            .innerText.split('\n');
          const artistArray = titleAndArtist[titleAndArtist.length - 1].split(', ');

          track.title = titleAndArtist[0];
          track.album = nodeDetails.querySelector('div[aria-colindex="3"]').innerText;
          track.duration = nodeDetails.innerText.split('\n').pop();
          track.artist = artistArray[0];
          track.otherArtists = artistArray.slice(1);

          tracks.push(track);
        }
      }
    }

    return tracks;

  }

  const wait = async (time) => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve('done');
      }, time);
    });
  };

  async function extractPlaylist(): Promise<Playlist> {
    const playlist = getPlaylistGeneralInfo();

    const scrollBar = getScrollBar();
    const scrollHeight = scrollBar.height;

    let processedIndex = 0;
    const extractedTracks = [];
    const x = scrollBar.x + scrollBar.width / 2;
    let y = scrollBar.y;

    const scrollBarElement = document.querySelectorAll('.os-scrollbar-track')[1];

    while (processedIndex < playlist.numberOfTrack) {
      const newTracks = getTracksFromDOM(processedIndex);
      if (newTracks.length) {
        processedIndex = newTracks[newTracks.length - 1].index;
        extractedTracks.push(...newTracks);
      }

      // console.log('Process: ' + processedIndex + '\n');

      const evt = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: x,
        clientY: y,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null
      });
      scrollBarElement.dispatchEvent(evt);
      y += scrollHeight;

      await wait(1000);

    }

    playlist.tracks = extractedTracks;

    return playlist;
  }

  const playlists = await extractPlaylist();

  ipcRenderer.sendToHost(JSON.stringify(playlists));
});
