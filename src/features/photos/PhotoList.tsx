import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPhotos,
  selectFetching,
  selectHasNextPage,
  nextPageAsync,
} from './photosSlice';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { PhotoListItem } from './PhotoListItem';
import { VisibilityTrigger } from '../../components/VisibilityTrigger';
import { Spinner } from './Spinner';
import { PhotoData } from '../../services/flickr';

export type PhotoListProps = { className?: string; photos: PhotoData[] };

// Material UI's built-in JSS styling
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // I like to add a lot of spacing below a grid like this - maybe
    // I'm making it up, but I feel like it helps the user intuit
    // that there can be more content
    marginBottom: theme.spacing(20),
  },

  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridAutoFlow: 'row dense',
    gap: `${theme.spacing(2)}px`,

    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },

  gridItem: {
    position: 'relative',
    // an old trick for 1:1 ratio enforcement
    paddingTop: '100%',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    // helps to block out the space of the item if the image
    // is slow to load
    backgroundColor: theme.palette.grey[200],
  },

  gridItemContents: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

/**
 * Renders the results of a photo search in a grid. Items can be clicked
 * to open the lightbox.
 */
export function PhotoList({ className, photos, ...props }: PhotoListProps) {
  const classes = useStyles();

  const fetching = useSelector(selectFetching);
  const hasNextPage = useSelector(selectHasNextPage);

  const dispatch = useDispatch();

  const fetchNextPage = React.useCallback(() => {
    dispatch(nextPageAsync());
  }, [dispatch]);

  return (
    <div className={clsx(classes.root, className)} {...props}>
      <div className={classes.grid}>
        {photos.map((photo) => (
          <div className={classes.gridItem} key={photo.id}>
            <PhotoListItem photo={photo} className={classes.gridItemContents} />
          </div>
        ))}
      </div>
      {/* Loading spinner for fetching state */}
      {fetching && <Spinner />}
      {/* Only show more if there's more to show */}
      {!fetching && hasNextPage && (
        <VisibilityTrigger onVisible={fetchNextPage} />
      )}
    </div>
  );
}
