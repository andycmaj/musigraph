import React from 'react';
import Search from './components/Search';
import Crumbs from './components/Crumbs';
import Splash from './components/Splash';
import Header from './components/Header';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif
  }
`;

const App = () => (
  <div>
    <Header />
    <Splash />
    <Search />
    <Crumbs />
    <GlobalStyle />
  </div>
);

export default App;
