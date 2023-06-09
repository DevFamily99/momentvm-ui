import React from 'react';
import { PageProps } from 'gatsby';
import PageFolders from '../components/folders/PageFolders';
import { Router } from '@reach/router';

const Pages = (props: PageProps) => {
  return (
    <Router>
      <PageFolders path="/page_archive/*" />
    </Router>
  );
};

export default Pages;
