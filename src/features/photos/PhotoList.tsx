import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  selectPhotos,
  selectFetching,
  selectHasNextPage,
  nextPageAsync,
} from './photosSlice';
import { CircularProgress, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { PhotoListItem } from './PhotoListItem';
import { VisibilityTrigger } from '../../components/VisibilityTrigger';

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
export function PhotoList({ className, ...props }: { className?: string }) {
  const classes = useStyles();

  const photos = useSelector(selectPhotos);
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
      {/*
        delay showing the spinner for 2 seconds - if the content loads
        faster, we never show a spinner, which makes the user feel like
        the loading was faster.

        React Suspense is also a great solution for this, but I opted
        for a Redux-based async lifecycle and haven't really worked
        out whether Suspense has a good compatibility story with Redux in
        general. I'm used to working with GraphQL clients, though,
        which largely support Suspense for data fetching even though
        it's not 'official' yet.
      */}
      {fetching && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 80 }}
          transition={{ delay: 2 }}
        >
          <CircularProgress />
        </motion.div>
      )}
      {/* Only show more if there's more to show */}
      {!fetching && hasNextPage && (
        <VisibilityTrigger onVisible={fetchNextPage} />
      )}
    </div>
  );
}
