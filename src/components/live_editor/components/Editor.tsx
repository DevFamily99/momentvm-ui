import React, { useState, useEffect } from 'react';
import SplitterLayout from 'react-splitter-layout';
import styled from 'styled-components';
import Url from 'url-parse';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import PreviewWindow from './PreviewWindow';
import ModuleForm from './ModuleForm';
import Navigation from './Navigation';
import ReorderModules from './ReorderModules';
import AddNewModule from './AddNewModule';
import '../styles/globalEditorStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import LocaleSelector from './LocaleSelector';

const StyledWrapper = styled.div`
  input[type='color' i] {
    height: 40px;
    width: 8rem;
  }
  font-family: 'Nunito Sans';
  body {
    background-color: rgb(246, 246, 246);
  }
  fieldset {
    border: 0;
    padding-left: 2rem;
  }
  input {
    background-color: white;
    border-radius: 4px;
    border: 1px solid rgb(222, 222, 222);
    padding: 0.7rem 1rem;
  }
  button {
    transition: all 0.4s ease-in-out;
  }
  button:hover {
    transform: scale(1.1);
  }
  .MuiSelect-root {
    border: 1px solid rgb(222, 222, 222);
    background-color: white;
  }
  .MuiFormControl-root {
    padding-bottom: 0.6rem;
  }
  label {
    margin: 0.6rem 0;
  }
  label[for='root_items'] {
    font-size: 1.6rem;
    margin: 1rem 0;
  }
  legend {
    display: none;
  }
  iframe[name='editor-preview'] {
    animation: fadein 2s;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Editor = () => {
  const [resizing, setResizing] = useState(false);
  const [pageModuleId, setPageModuleId] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [reorderListOpen, setReorderListOpen] = useState(false);
  const [newModuleOpen, setNewModuleOpen] = useState(false);
  const [iframeContent, setIframeContent] = useState('');

  const currentUrl = new Url(window.location.href);
  const urlSections = currentUrl.pathname.split('/');
  const pageId = urlSections[2];
  let locale = urlSections[3];
  if (locale === 'schedule') {
    locale = 'default';
  }
  const [previewLocale, setPreviewLocale] = useState(
    locale === 'en-GB' ? 'default' : locale,
  );
  const iframeSrc = (locale) => {
    const currentUrl = new Url(window.location.href);
    const urlSections = currentUrl.pathname.split('/');
    const previewLocale = locale || 'default';
    const scheduleId = urlSections[4];

    if (currentUrl.pathname.match(/schedule/)) {
      return `${process.env.GATSBY_API_URL}/pages/${pageId}/${scheduleId}/${previewLocale}/view-only-schedule-preview.json`;
    }
    return `${process.env.GATSBY_API_URL}/pages/${pageId}/${previewLocale}/view-only-live-preview.json`;
  };

  const reloadPreview = () => {
    setPreviewLoading(true);
    axios.get(iframeSrc(previewLocale)).then((res) => {
      setIframeContent(res.data.content);
      setPreviewLoading(false);
    });
  };
  useEffect(() => {
    reloadPreview();
  }, [previewLocale]);
  
  return (
    <StyledWrapper>
      <SplitterLayout
        primaryIndex={0}
        primaryMinSize={435}
        secondaryMinSize={300}
        onDragStart={() => setResizing(true)}
        onDragEnd={() => setResizing(false)}
      >
        <div>
          <LocaleSelector
            previewLocale={previewLocale}
            setPreviewLocale={setPreviewLocale}
          />
          <Navigation
            setReorderListOpen={setReorderListOpen}
            setNewModuleOpen={setNewModuleOpen}
          />
          {reorderListOpen && (
            <ReorderModules
              setReorderListOpen={setReorderListOpen}
              reloadPreview={reloadPreview}
              setPageModuleId={setPageModuleId}
            />
          )}
          {newModuleOpen && <AddNewModule setNewModuleOpen={setNewModuleOpen} />}
          <br />
          {pageModuleId && !reorderListOpen && !newModuleOpen && (
            <ModuleForm
              pageId={pageId}
              pageModuleId={pageModuleId}
              setPageModuleId={setPageModuleId}
              reloadPreview={reloadPreview}
              setReorderListOpen={setReorderListOpen}
              setNewModuleOpen={setNewModuleOpen}
            />
          )}
        </div>
        <PreviewWindow
          locale={previewLocale}
          resizing={resizing}
          reloadPreview={reloadPreview}
          setPageModuleId={setPageModuleId}
          previewLoading={previewLoading}
          setPreviewLoading={setPreviewLoading}
          setReorderListOpen={setReorderListOpen}
          setNewModuleOpen={setNewModuleOpen}
          iframeContent={iframeContent}
        />
      </SplitterLayout>
      <ToastContainer />
    </StyledWrapper>
  );
};

export default Editor;
