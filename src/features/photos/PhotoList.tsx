import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectPhotos } from './photosSlice';
import { Photo } from './Photo';

export function PhotoList() {
  const photos = useSelector(selectPhotos);

  return (
    <div>
      {photos.map((photo) => (
        <Photo photo={photo} key={photo.id} />
      ))}
    </div>
  );
}
