import { isEmpty } from 'lodash';

export function isValidPort(value): boolean {
  return typeof value === 'number' && value > 1024 && value < 49151;
}

type Thumbnail = {
  height: number;
  width: number;
  url: string;
}

export const getLargestThumbnail = (thumbnails: Thumbnail[]): string => {
  const isNotEmpty = !isEmpty(thumbnails);
  const largestThumbnail = isNotEmpty && thumbnails.reduce((prev, current) => {
    return (prev.height * prev.width) > (current.height * current.width) ? prev : current;
  });

  return largestThumbnail?.url;
};

export const getThumbnailSizedImage = (images: Thumbnail[], width=400, height=400): string => {
  const isNotEmpty = !isEmpty(images);
  const thumbnail = isNotEmpty && images.find(image => image.height === height && image.width === width);
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
