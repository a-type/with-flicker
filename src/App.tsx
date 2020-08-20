import React from 'react';
import { Search } from './features/photos/Search';
import { Container, makeStyles } from '@material-ui/core';
import { PhotoList } from './features/photos/PhotoList';

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
    width: '50vw',
    position: 'sticky',
    top: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
  },
  list: {
    marginTop: theme.spacing(4),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Search className={classes.search} />
      <PhotoList className={classes.list} />
    </Container>
  );
}

export default App;
