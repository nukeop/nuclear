import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import styles from './styles.scss';

const SmoothImage = ({
  placeholder = artPlaceholder,
  src,
  alt,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <div {...props} className={styles.smooth_image_wrapper}>
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onLoad={handleLoaded}
      />
      <img
        src={placeholder}
        alt={alt}
        className={styles.placeholder}
        style={{
          opacity: loaded ? 0 : 1
        }}
      />
    </div>
  );
};

SmoothImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  alt: PropTypes.string
};

export default SmoothImage;
