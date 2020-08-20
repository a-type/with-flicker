import * as React from 'react';
import { PhotoData } from './photosSlice';

export type PhotoProps = {
  photo: PhotoData;
};

export function Photo({ photo }: PhotoProps) {
  const src = React.useMemo(() => {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  }, [photo]);

  return <img src={src} alt={photo.title} />;
}
