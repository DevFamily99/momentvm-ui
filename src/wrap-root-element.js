import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';

/** Gatsby API to be imported and exported in gatsby-ssr and gatsby-browser */
export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
export default wrapRootElement;
