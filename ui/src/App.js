import React from 'react';
import Search from './components/Search';
import Crumbs from './components/Crumbs';
import Splash from './components/Splash';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif
  }
`;

const App = () => (
  <div>
    <Splash />
    <Search />
    <Crumbs />
    <GlobalStyle />
  </div>
);

export default App;
