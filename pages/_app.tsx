import 'isomorphic-unfetch';
import React, { ReactNode } from 'react';
import App, { Container, AppInitialProps } from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'lib/withRedux';
import initStore from 'lib/store';
import { ThemeProvider } from 'styled-components';
import { NextComponentType, NextPageContext } from 'next';
import { Router } from 'next/dist/client/router';
import { Store } from 'redux';

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      const pageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {};

      return {
        pageProps,
      };
    }

    render() {
      const { Component, pageProps, store, isServer } = this.props as Readonly<
        AppInitialProps & {
          Component: NextComponentType<NextPageContext, any, {}>;
          router: Router;
        }
      > &
        Readonly<{ children?: ReactNode }> & {
          store: Store;
          isServer: boolean;
        };

      if (isServer) {
        // Force redux-simple-storage to write to localStorage on load.
        // when getting re-hydrated initial state from server-side, we
        // want to make sure we persist this state as soon as the store
        // is de-hydrated.
        store.dispatch({ type: 'dummy' });
      }

      return (
        <Container>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>
        </Container>
      );
    }
  }
);
