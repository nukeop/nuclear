import { FC } from 'react';

import { cn } from '../../utils';
import { ImageReveal } from '../ImageReveal/ImageReveal';

type MosaicProps = {
  urls: string[];
  className?: string;
};

export const Mosaic: FC<MosaicProps> = ({ urls, className }) => {
  return (
    <div className={cn('grid grid-cols-2 grid-rows-2', className)}>
      {urls.slice(0, 4).map((url, index) => (
        <ImageReveal
          key={`${url}-${index}`}
          src={url}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      ))}
    </div>
  );
};
