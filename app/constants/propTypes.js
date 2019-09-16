import PropTypes from 'prop-types';

const trackImageShape = PropTypes.shape({
  '#text': PropTypes.string,
  size: PropTypes.oneOf('small', 'medium', 'large', 'extralarge')
});

export const trackShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  mbid: PropTypes.string,
  artist: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  url: PropTypes.string,
  image: PropTypes.arrayOf(trackImageShape)
});

const albumArtistShape = PropTypes.shape({
  join: PropTypes.string,
  name: PropTypes.string.isRequired,
  anv: PropTypes.string,
  tracks: PropTypes.string,
  role: PropTypes.string,
  resource_url: PropTypes.string,
  id: PropTypes.number
});

const albumImageShape = PropTypes.shape({
  height: PropTypes.number.isRequired,
  resource_url: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary']),
  uri: PropTypes.string.isRequired,
  uri150: PropTypes.string,
  width: PropTypes.number.isRequired
});

export const albumShape = PropTypes.shape({
  artists: PropTypes.arrayOf(albumArtistShape),
  id: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(albumImageShape),
  title: PropTypes.string.isRequired
});

export const favoriteTrackShape = Object.assign(trackShape, PropTypes.shape({
  uuid: PropTypes.string.isRequired
}));

export const favoriteAlbumShape = Object.assign(albumShape, PropTypes.shape({
  uuid: PropTypes.string.isRequired
}));
