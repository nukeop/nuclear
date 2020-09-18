export { default as AudiusMetaProvider } from './audius';
export { default as DiscogsMetaProvider } from './discogs';
export { default as MusicbrainzMetaProvider } from './musicbrainz';

// Bandcamp plugin has to be disabled due to bundling errors caused by the scraper.
// TODO: Replace the scraper with a custom one, and re-enable this plugin
// export { default as BandcampMetaProvider } from './bandcamp';
