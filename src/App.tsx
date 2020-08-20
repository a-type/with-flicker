import React from 'react';
import { Search } from './features/photos/Search';
import { Container } from '@material-ui/core';
import { PhotoList } from './features/photos/PhotoList';

function App() {
  return (
    <Container maxWidth="lg" className="App">
      <Search />
      <PhotoList />
    </Container>
  );
}

export default App;
