import React from 'react';
import { PageProps } from 'gatsby';
import AssetFolders from '../components/folders/AssetFolders';
import { Router } from '@reach/router';

const Pages = (props: PageProps) => {
  return (
    <Router>
      <AssetFolders path="/assets/*" />
    </Router>
  );
};

export default Pages;
