import { isEmpty } from 'lodash';

export function isValidPort(value): boolean {
  return typeof value === 'number' && value > 1024 && value < 49151;
}

type Thumbnail = {
  height?: number;
  width?: number;
  url: string;
}

export const getLargestThumbnail = (thumbnails: Thumbnail[]): string => {
  const isNotEmpty = !isEmpty(thumbnails);
  
  if (!isNotEmpty) {
    return undefined;
  }

  // If objects don't have width/height, just pick the first one
  const hasValidDimensions = thumbnails.some(thumb => thumb.height && thumb.width);
  if (!hasValidDimensions) {
    return thumbnails[0]?.url;
  }

  const largestThumbnail = thumbnails.reduce((prev, current) => {
    const prevSize = (prev.height || 0) * (prev.width || 0);
    const currentSize = (current.height || 0) * (current.width || 0);
    return prevSize > currentSize ? prev : current;
  });

  return largestThumbnail?.url;
};

export const getThumbnailSizedImage = (images: Thumbnail[], width=400, height=400): string => {
  const isNotEmpty = !isEmpty(images);
  
  if (!isNotEmpty) {
    return undefined;
  }

  // If objects don't have width/height, just pick the first one
  const hasValidDimensions = images.some(img => img.height && img.width);
  if (!hasValidDimensions) {
    return images[0]?.url;
  }

  const thumbnail = images.find(image => 
    image.height && image.width && 
    image.height >= height && image.width >= width
  );
  return thumbnail?.url;
};

export const getImageSet = (images: Thumbnail[]): { thumb: string; coverImage: string; } => {
  const largestImage = getLargestThumbnail(images);
  const thumbnail = getThumbnailSizedImage(images, 400, 400);

  return {
    thumb: thumbnail,
    coverImage: largestImage
  };
};
