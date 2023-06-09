/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Layout from './src/components/Layout';
import PublicLayout from './src/components/PublicLayout';

export const wrapPageElement = ({ element, props }) => {
  // dont render layout here
  if (props.path.match(/^\/pages/)) {
    return element;
  }

  // render public layout
  if (
    props.path.match(/^\/login/) ||
    props.path.match(/^\/reset-password/) ||
    props.path.match(/^\/team-signup/)
  ) {
    return <PublicLayout>{element}</PublicLayout>;
  }

  // these pages share the dnd logic, so only dont rerender it
  if (
    props.path.match(/^\/page_folders/) ||
    props.path.match(/^\/page_archive/) ||
    props.path.match(/^\/assets/)
  ) {
    return (
      <Layout>
        <DndProvider backend={Backend}>{element}</DndProvider>
      </Layout>
    );
  }

  return <Layout>{element}</Layout>;
};

// To wrap root into apollo context
export { wrapRootElement } from './src/wrap-root-element';
