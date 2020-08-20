import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPhotos,
  selectFetching,
  selectHasNextPage,
  nextPageAsync,
} from './photosSlice';
import { Photo } from './Photo';
import { CircularProgress, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoFlow: 'row dense',
    gap: `${theme.spacing(2)}px`,

    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
  gridItem: {
    // using an old trick to enforce aspect ratio
    position: 'relative',
    paddingTop: '100%',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
  },
  /**
   * @note - when it comes to layout, I prefer to define a layout-relevant
   * child class in the parent. This consolidates the locations of the styles
   * required to achieve the layout, allows you to use different kinds of components
   * as children with visual consistency, and just generally avoids coupling.
   */
  gridItemContents: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

export function PhotoList() {
  const classes = useStyles();

  const photos = useSelector(selectPhotos);
  const fetching = useSelector(selectFetching);
  const hasNextPage = useSelector(selectHasNextPage);

  const dispatch = useDispatch();
  const fetchNextPage = React.useCallback(() => {
    dispatch(nextPageAsync());
  }, [dispatch]);

  return (
    <>
      <div className={classes.grid}>
        {photos.map((photo) => (
          <div className={classes.gridItem} key={photo.id}>
            <Photo photo={photo} className={classes.gridItemContents} />
          </div>
        ))}
      </div>
      {/* Loading spinner for fetching state */}
      {fetching && <CircularProgress />}
      {/* Only show more if there's more to show */}
      {hasNextPage && <Button onClick={fetchNextPage}>Show more</Button>}
    </>
  );
}
