import React from 'react';
import ArtistSearch from './components/ArtistSearch';
import MusiGraph from './components/MusiGraph-d3';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
`;

const App = () => (
  <div>
    <ArtistSearch />
    <MusiGraph />
    <GlobalStyle />
  </div>
);

export default App;
