import * as React from 'react';
import { PhotoData } from '../../services/flickr';

export type PhotoProps = React.HTMLAttributes<HTMLImageElement> & {
  photo: PhotoData;
};

export function Photo({ photo, ...rest }: PhotoProps) {
  const src = React.useMemo(() => {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  }, [photo]);

  return <img src={src} alt={photo.title} {...rest} />;
}
