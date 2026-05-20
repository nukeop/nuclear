import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FC, ReactNode, useEffect, useState } from 'react';

import { cn } from '../../utils';

type ImageRevealProps = {
  src?: string;
  alt?: string;
  enabled?: boolean;
  className?: string;
  imgClassName?: string;
  placeholder?: ReactNode;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  transitionDuration?: number;
  ease?: [number, number, number, number];
  onLoad?: () => void;
  onError?: () => void;
};

export const ImageReveal: FC<ImageRevealProps> = ({
  src,
  alt,
  enabled = true,
  className,
  imgClassName,
  placeholder,
  loading = 'lazy',
  decoding = 'async',
  transitionDuration = 0.6,
  ease = [0.22, 1, 0.36, 1],
  onLoad,
  onError,
}) => {
  const prefersReduced = useReducedMotion();
  const animationsDisabled = !enabled || !!prefersReduced;

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const showImage = Boolean(src) && !errored;

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setErrored(true);
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showImage &&
        (animationsDisabled ? (
          <img
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover', imgClassName)}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            decoding={decoding}
          />
        ) : (
          <motion.img
            key={src}
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover', imgClassName)}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{
              opacity: loaded ? 1 : 0,
              scale: loaded ? 1 : 0.98,
              filter: loaded ? 'blur(0px)' : 'blur(8px)',
            }}
            transition={{ duration: transitionDuration, ease }}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            decoding={decoding}
          />
        ))}

      {!showImage && placeholder && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {placeholder}
        </div>
      )}

      {src &&
        !loaded &&
        !errored &&
        placeholder &&
        (animationsDisabled ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {placeholder}
          </div>
        ) : (
          <AnimatePresence initial>
            <motion.div
              key="image-reveal-placeholder"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {placeholder}
            </motion.div>
          </AnimatePresence>
        ))}
    </div>
  );
};
