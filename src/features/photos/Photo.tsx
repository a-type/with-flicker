import * as React from 'react';
import { PhotoData } from '../../services/flickr';
import { motion, MotionProps } from 'framer-motion';

/**
 * These are taken from Flickr's docs: https://www.flickr.com/services/api/misc.urls.html
 */
export enum PhotoFormat {
  // 150x150
  Square = '_q',
  // no size variation
  Large = '',
}

// proptypes extend MotionProps to make it animateable
export type PhotoProps = MotionProps & {
  photo: PhotoData;
  format?: PhotoFormat;
  className?: string;
};

/**
 * A simple Photo component which does the arcane Flickr URL
 * construction internally.
 */
export function Photo({
  photo,
  format = PhotoFormat.Large,
  ...rest
}: PhotoProps) {
  const src = React.useMemo(() => {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${format}.jpg`;
  }, [photo, format]);

  return <motion.img src={src} alt={photo.title} {...rest} />;
}
