import React from 'react';
import Search from './components/Search';
import MusiCrumbs from './components/MusiCrumbs';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif
  }
`;

const App = () => (
  <div>
    <Search />
    <MusiCrumbs />
    <GlobalStyle />
  </div>
);

export default App;
