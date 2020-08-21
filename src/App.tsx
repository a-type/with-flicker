import React from 'react';
import { Search } from './features/photos/Search';
import { Container, makeStyles } from '@material-ui/core';
import { PhotoList } from './features/photos/PhotoList';
import { Lightbox } from './features/photos/Lightbox';
import { useSelector } from 'react-redux';
import { selectPhotos, selectIsInitial } from './features/photos/photosSlice';
import { EmptyState } from './components/EmptyState';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  /**
   * @note - when it comes to layout, I prefer to define a layout-relevant
   * child class in the parent. This consolidates the locations of the styles
   * required to achieve the layout, allows you to use different kinds of components
   * as children with visual consistency, and just generally avoids coupling.
   */
  search: {
    alignSelf: 'center',
    position: 'sticky',
    top: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
    },
  },
  list: {
    marginTop: theme.spacing(4),
  },
}));

function App() {
  const classes = useStyles();

  const photos = useSelector(selectPhotos);
  const initial = useSelector(selectIsInitial);

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Search className={classes.search} />
      {photos.length ? (
        <PhotoList className={classes.list} photos={photos} />
      ) : initial ? (
        <EmptyState />
      ) : null}
      <Lightbox />
    </Container>
  );
}

export default App;
