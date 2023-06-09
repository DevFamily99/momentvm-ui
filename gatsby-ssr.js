/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import { DndProvider } from 'react-dnd';
import Layout from './src/components/Layout';

export const wrapPageElement = ({ element, props }) => {
  // dont render layout here
  if (props.path.match(/^\/login/) || props.path.match(/^\/pages/)) {
    return element;
  }

  // these pages share the dnd logic, so dont rerender it
  if (props.path.match(/^\/page_folders/) || props.path.match(/^\/assets/)) {
    return (
      <Layout>
        <DndProvider backend={Backend}>{element}</DndProvider>
      </Layout>
    );
  }

  return <Layout>{element}</Layout>;
};
