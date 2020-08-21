import * as React from 'react';
import { PhotoData } from '../../services/flickr';
import { useDispatch } from 'react-redux';
import { focusPhoto } from './photosSlice';
import { ButtonBase, makeStyles } from '@material-ui/core';
import { Photo, PhotoFormat } from './Photo';
import clsx from 'clsx';

export type PhotoListItemProps = {
  photo: PhotoData;
  className?: string;
};

const useStyles = makeStyles(() => ({
  root: {},
  photo: {
    width: '100%',
    height: '100%',
  },
}));

export function PhotoListItem({ photo, className }: PhotoListItemProps) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { id: photoId } = photo;

  const handleClick = React.useCallback(() => {
    dispatch(focusPhoto({ id: photoId }));
  }, [dispatch, photoId]);

  return (
    <ButtonBase onClick={handleClick} className={clsx(classes.root, className)}>
      <Photo
        photo={photo}
        format={PhotoFormat.Square}
        className={classes.photo}
        whileHover={{
          scale: 1.1,
        }}
      />
    </ButtonBase>
  );
}
