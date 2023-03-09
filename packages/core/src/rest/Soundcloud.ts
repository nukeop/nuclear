import SoundCloud from 'soundcloud-scraper';
const apiUrl = 'https://api.soundcloud.com';

let client;

const generateClient = async () => {
  const key =  await SoundCloud.Util.keygen();
  client = new SoundCloud.Client(key);
};

generateClient();

function prepareUrl(url: string): string {
  return `${url}&client_id=${process.env.SOUNDCLOUD_API_KEY}`;
}

export async function soundcloudSearch(terms: string) {
  const trackData = [];
  const searchResults = await client.search(terms)
    .then(async song => song)
    .catch(console.error);

  const track = await fetch(`https://api-widget.soundcloud.com/resolve?url=https%3A%2F%2Fsoundcloud.com%2F${searchResults[0].artist}%2F${searchResults[0].itemName}&format=json&client_id=${client.API_KEY}`).then(r => r.json());
  const stream = await fetch(`${track.media.transcodings[0].url}?client_id=${client.API_KEY}&track_authorization=${track.track_authorization}`).then(r => r.json());

  return {...track, stream: stream.url};


  // const streamLink = trackDetails?.media?.transcodings[0]?.url;
  // const trackAuth = trackDetails?.track_authorization;
  
  // const stream = fetch(`${streamLink}?client_id=${client.API_KEY}&track_authorization=${trackAuth}`).then(r => r.json());


  // return fetch(prepareUrl(apiUrl + '/tracks?limit=50&q=' + terms));
}

export async function getTrackById(id: string) {


  // const artist = results[0]?.artist;
  // const song = results[0]?.itemName;

  // const trackDetails = await fetch(`https://api-widget.soundcloud.com/resolve?url=https%3A%2F%2Fsoundcloud.com%2F${artist}%2F${song}&format=json&client_id=${client.API_KEY}`).then(r =>  r.json());
  // const streamLink = trackDetails?.media?.transcodings[0]?.url;
  // const trackAuth = trackDetails?.track_authorization;
  
  // const stream = fetch(`${streamLink}?client_id=${client.API_KEY}&track_authorization=${trackAuth}`).then(r => r.json());


  return fetch(prepareUrl(`${apiUrl}/tracks/${id}`));
}
