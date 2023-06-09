import React, { useEffect, useState } from 'react';
import { Router } from '@reach/router';
import axios from 'axios';
import Layout from '../components/Layout';
import Page from '../components/page/Page';
import LiveEditor from '../components/live_editor/components/Editor';

const PageWithLayout = (props) => (
  <Layout>
    <Page {...props} />
  </Layout>
);

const iframeStyle = {
  height: '99vh',
};

const ViewOnlyPreview = ({ uri }) => {
  const [iframeContent, setIframeContent] = useState('');
  useEffect(() => {
    axios.get(process.env.GATSBY_API_URL + uri).then((res) => {
      setIframeContent(res.data);
    });
  }, []);
  const iframe = () => {
    return document.getElementById('preview_page') as HTMLIFrameElement;
  };
  const removeOverlay = () => {
    const onFrameDOMContentLoaded = () => {
      if (iframe() === null && iframe() === undefined) {
        return null;
      }
      const previewCss = iframe().contentWindow.document.querySelectorAll(
        "link[href='/previewIframe.css']",
      )[0];
      if (previewCss) {
        previewCss.remove();
      }
    };
    setTimeout(onFrameDOMContentLoaded, 0);
  };
  return (
    <iframe
      name="editor-preview"
      title="preview"
      id="preview_page"
      frameBorder="0"
      width="100%"
      onLoad={() => {
        removeOverlay();
      }}
      style={iframeStyle}
      srcDoc={iframeContent}
    />
  );
};

const Pages = () => (
  <Router>
    <PageWithLayout path="pages/:id" />
    <LiveEditor path="pages/:id/:locale/live-preview" />
    <LiveEditor path="pages/:id/schedule/:scheduleId" />
    <ViewOnlyPreview path="pages/:id/:locale/view-only-live-preview" />
  </Router>
);
export default Pages;
