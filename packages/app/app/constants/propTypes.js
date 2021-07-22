import PropTypes from 'prop-types';

export const trackShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  mbid: PropTypes.string,
  artist: PropTypes.oneOfType([
    PropTypes.shape({
      name: PropTypes.string
    }),
    PropTypes.string
  ]).isRequired,
  url: PropTypes.string,
  image: PropTypes.arrayOf(PropTypes.shape({
    '#text': PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'extralarge'])
  }))
});

export const favoriteTrackShape = Object.assign(trackShape, PropTypes.shape({
  uuid: PropTypes.string.isRequired
}));
