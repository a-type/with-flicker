import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusedPhoto, closeFocusedPhoto } from './photosSlice';
import { Dialog, makeStyles } from '@material-ui/core';
import { Photo } from './Photo';

export type LightboxProps = {
  className?: string;
};

const useStyles = makeStyles(() => ({
  photo: {
    // keep the aspect ratio of the image, while scaling it
    // to fill a good portion of the viewport
    width: '80vw',
    height: 'auto',
  },
}));

/**
 * Renders the currently active photo in a lightbox display, if there is one.
 */
export function Lightbox({ className }: LightboxProps) {
  const classes = useStyles();

  const focusedPhoto = useSelector(selectFocusedPhoto);
  const dispatch = useDispatch();

  const onClose = React.useCallback(() => {
    dispatch(closeFocusedPhoto());
  }, [dispatch]);

  return (
    <Dialog open={!!focusedPhoto} onClose={onClose} className={className}>
      {!!focusedPhoto && (
        <Photo photo={focusedPhoto} className={classes.photo} />
      )}
    </Dialog>
  );
}
