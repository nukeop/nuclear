import React, { useCallback, useState } from 'react';

import styles from './styles.scss';

type SmoothImageProps = {
  src: string;
  placeholder?: string;
  alt?: string;
}

const artPlaceholder = '../../../resources/media/art_placeholder.png';


const SmoothImage: React.FC<SmoothImageProps> = ({
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

export default SmoothImage;
