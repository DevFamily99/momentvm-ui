import React from 'react';
import { PageProps } from 'gatsby';
import { Router } from '@reach/router';
import Templates from '../components/templates/Templates';
import Template from '../components/templates/Template';
import Versions from '../components/templates/Versions';
import Version from '../components/templates/VersionChanges';
import TemplateArchive from '../components/templates/TemplateArchive';

const TempaltesPage = (props: PageProps) => {
  return (
    <Router>
      <Templates path="/templates" />
      <TemplateArchive path="/templates/archive" />
      <Template path="/templates/:template" />
      <Versions path="/templates/:template/versions" />
      <Version path="/templates/:template/versions/:version" />
    </Router>
  );
};

export default TempaltesPage;
