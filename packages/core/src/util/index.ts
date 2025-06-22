import { isEmpty } from 'lodash';

export function isValidPort(value): boolean {
  return typeof value === 'number' && value > 1024 && value < 49151;
}

type Thumbnail = {
  height?: number;
  width?: number;
  maxHeight?: number;
  maxWidth?: number;
  url: string;
};

const getImageDimensions = (image: Thumbnail) => ({
  height: image.height || image.maxHeight,
  width: image.width || image.maxWidth
});

export const getLargestThumbnail = (thumbnails: Thumbnail[] | null): string => {
  if (!thumbnails || isEmpty(thumbnails)) {
    return undefined;
  }

  // If objects don't have width/height, just pick the first one
  const hasValidDimensions = thumbnails?.some((thumb) => {
    const { height, width } = getImageDimensions(thumb);
    return height && width;
  });

  if (!hasValidDimensions) {
    return thumbnails[0]?.url;
  }

  const largestThumbnail = thumbnails.reduce((prev, current) => {
    const { height: prevHeight, width: prevWidth } = getImageDimensions(prev);
    const { height: currentHeight, width: currentWidth } =
      getImageDimensions(current);
    const prevSize = (prevHeight || 0) * (prevWidth || 0);
    const currentSize = (currentHeight || 0) * (currentWidth || 0);
    return prevSize > currentSize ? prev : current;
  });
  return largestThumbnail?.url;
};

export const getThumbnailSizedImage = (
  images: Thumbnail[],
  width = 400,
  height = 400
): string => {
  if (!images || isEmpty(images)) {
    return undefined;
  }

  // If objects don't have width/height, just pick the first one
  const hasValidDimensions = images.some((img) => {
    const { height, width } = getImageDimensions(img);
    return height && width;
  });
  if (!hasValidDimensions) {
    return images[0]?.url;
  }

  const thumbnail = images.find((image) => {
    const { height: imageHeight, width: imageWidth } =
      getImageDimensions(image);
    return (
      imageHeight && imageWidth && imageHeight >= height && imageWidth >= width
    );
  });
  return thumbnail?.url;
};

export const getImageSet = (
  images: Thumbnail[]
): { thumb: string; coverImage: string } => {
  const largestImage = getLargestThumbnail(images);
  const thumbnail = getThumbnailSizedImage(images, 400, 400);

  return {
    thumb: thumbnail,
    coverImage: largestImage
  };
};
