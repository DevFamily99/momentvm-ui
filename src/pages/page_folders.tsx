import React from 'react';
import { PageProps } from 'gatsby';
import PageFolders from '../components/folders/PageFolders';
import { Router } from '@reach/router';

const PageFoldersPage = (props: PageProps) => {
  return (
    <Router>
      <PageFolders path="/page_folders/*" />
    </Router>
  );
};

export default PageFoldersPage;
