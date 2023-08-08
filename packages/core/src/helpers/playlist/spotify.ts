/* eslint-disable node/no-extraneous-require */
/* eslint-disable @typescript-eslint/no-var-requires */
type SpotifyTrack = {
  index: number;
  id?: string;
  thumbnail: string;
  title: string;
  album: string;
  duration: string;
  artist: string;
  otherArtists?: string[];
}

type SpotifyPlaylist = {
  name: string;
  totalTracks: number;
  source: 'Spotify';
  tracks: SpotifyTrack[];
}

export default (async function () {
  const { ipcRenderer } = window.require('electron');

  function getPlaylistGeneralInfo() {
    const tracklistContainer = document.querySelector('div[data-testid="playlist-tracklist"]');
    const totalTracks = parseInt(
      tracklistContainer.getAttribute('aria-rowcount')
    ) - 1;
    const name = tracklistContainer.getAttribute('aria-label');

    return {
      name,
      totalTracks,
      tracks: [],
      source: 'Spotify' as const
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
    const cookieBanner = document.getElementById('onetrust-banner-sdk');

    if (cookieBanner) {
      cookieBanner.style.setProperty('display', 'none', 'important');
    }
    
    const nodeTracks = document.querySelector('div[data-testid="playlist-tracklist"] div[data-testid="top-sentinel"] + div').childNodes as NodeListOf<Element>;
    const tracks = [];

    for (let i = 0; i < nodeTracks.length; i += 1) {
      if (nodeTracks[i]) {
        const index = parseInt(nodeTracks[i].getAttribute('aria-rowindex'));

        if (index > processedIndex) {
          nodeTracks[i].scrollIntoView();
          const nodeDetails = nodeTracks[i].childNodes[0] as HTMLElement;
          const track: SpotifyTrack = {
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
            ?.getAttribute('src');

          const titleAndArtist = nodeDetails
            .querySelector<HTMLElement>('div[aria-colindex="2"]')
            .innerText.split('\n');
          const artistArray = titleAndArtist[titleAndArtist.length - 1].split(', ');

          track.title = titleAndArtist[0];
          track.album = nodeDetails.querySelector<HTMLElement>('div[aria-colindex="3"]').innerText;
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

  async function extractPlaylist(): Promise<SpotifyPlaylist> {
    const playlist = getPlaylistGeneralInfo();
    
    ipcRenderer.sendToHost('import-spotify-playlist-metadata', playlist);

    const scrollBar = getScrollBar();
    const scrollHeight = scrollBar.height;

    let processedIndex = 0;
    const extractedTracks = [];
    const x = scrollBar.x + scrollBar.width / 2;
    let y = scrollBar.y;

    const scrollBarElement = document.querySelectorAll('.os-scrollbar-track')[1];

    while (processedIndex < playlist.totalTracks) {
      ipcRenderer.sendToHost('import-spotify-playlist-progress', processedIndex);
      const newTracks = getTracksFromDOM(processedIndex);
      if (newTracks.length) {
        processedIndex = newTracks[newTracks.length - 1].index;
        extractedTracks.push(...newTracks);
      }

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

      await wait(500);
    }

    playlist.tracks = extractedTracks;
    return playlist;
  }

  const playlists = await extractPlaylist();

  ipcRenderer.sendToHost('import-spotify-playlist-success', playlists);
});
