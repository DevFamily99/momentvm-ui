import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useMutation, useLazyQuery } from '@apollo/client';
import Loader from '../../Loader';
import buildModuleInitialData from '../utils/moduleInitialData';
import {
  GET_TEMPLATE,
  CREATE_PAGE_MODULE,
  COPY_PAGE_MODULE,
  GET_PAGES_MODULES,
} from '../../../utils/queries';

const DragOverlay = styled.div`
  position: absolute;
  width: 90%;
  height: 90%;
  z-index: 999;
`;

const PreviewWindow = ({
  locale,
  resizing,
  reloadPreview,
  setPageModuleId,
  previewLoading,
  setPreviewLoading,
  setReorderListOpen,
  setNewModuleOpen,
  iframeContent,
}) => {
  const iframeStyle = {
    boxShadow: '0px 1px 37px 0px rgba(0,0,0,0.3)',
    minHeight: '963px',
    height: '100%',
  };

  useEffect(() => {
    setPreviewLoading(true);
  }, [locale]);

  const pageId = window.location.href.split('/')[4];
  const [createBelow, setCreateBelow] = useState(null);
  const [createPageModule] = useMutation(CREATE_PAGE_MODULE, {
    refetchQueries: [{ query: GET_PAGES_MODULES, variables: { id: pageId } }],
  });
  const [copyPageModule] = useMutation(COPY_PAGE_MODULE, {
    refetchQueries: [{ query: GET_PAGES_MODULES, variables: { id: pageId } }],
    onCompleted: () => {
      toast.success('Module Copied.');
      reloadPreview();
    },
  });
  const [getTemplate] = useLazyQuery(GET_TEMPLATE, {
    onCompleted: async (data) => {
      // create page module
      try {
        const schemaBody = JSON.parse(data.template.templateSchema.jsonBody);
        const pageModuleBody = buildModuleInitialData(schemaBody);
        const res = await createPageModule({
          variables: {
            pageId,
            templateId: data.template.id,
            pageModuleBody,
            createBelow,
          },
        });
        if (res.data) {
          toast.success('Module added successfully!');
          reloadPreview();
        }
      } catch (e) {
        toast.error(e.message);
      }
    },
  });

  const iframe = () => {
    return document.getElementById('preview_page') as HTMLIFrameElement;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    const marker = iframe().contentWindow.document.querySelectorAll(
      '.reserved-drop-marker',
    );
    if (marker.length > 0) {
      marker[0].parentNode.removeChild(marker[0]);
    }
    e.target.innerHTML = `${e.target.innerHTML}<p class='reserved-drop-marker'></p>`;
  };

  const handleDragLeave = () => {
    const marker = iframe().contentWindow.document.querySelectorAll(
      '.reserved-drop-marker',
    );
    if (marker.length > 0) {
      marker[0].parentNode.removeChild(marker[0]);
    }
  };

  const insertInitialModule = (InsertNewModule) => {
    const iframe = document.getElementById('preview_page') as HTMLIFrameElement;
    const placeholder = iframe.contentWindow.document.querySelector('.cms-placeholder');
    if (placeholder === null) {
      console.error('Placeholder element not found');
      return;
    }
    placeholder.addEventListener('dragenter', (e) => handleDragEnter(e), true);
    placeholder.addEventListener('dragover', (e) => e.preventDefault());
    placeholder.addEventListener('dragleave', () => handleDragLeave(), true);
    placeholder.addEventListener('drop', (e) => {
      if (e.dataTransfer.getData('pageModuleId') !== '') {
        copyPageModule({
          variables: {
            pageId,
            pageModuleId: e.dataTransfer.getData('pageModuleId'),
            createBelow: (e.target as HTMLElement).dataset.pageModuleId,
          },
        });
      } else {
        e.preventDefault();
        InsertNewModule(
          e.dataTransfer.getData('templateId'),
          (e.target as HTMLElement).dataset.pageModuleId,
        );
      }
    });
  };

  const InsertNewModule = (templateId, pageModuleId) => {
    setCreateBelow(pageModuleId);
    getTemplate({ variables: { id: templateId } });
  };

  const handleIframeLoad = (setPageModuleId) => {
    if (iframe() === null) {
      return;
    }
    const modules = iframe().contentWindow.document.querySelectorAll('.cms-page-module');
    const noModules = iframe().contentWindow.document.querySelector('.cms-placeholder');
    if (noModules) {
      insertInitialModule(InsertNewModule);
      return;
    }
    modules.forEach((module: HTMLElement) => {
      const { pageModuleId } = module.dataset;
      module.addEventListener('click', () => {
        setReorderListOpen(false);
        setNewModuleOpen(false);
        setPageModuleId(pageModuleId);
      });
      module.addEventListener('dragenter', (e) => handleDragEnter(e), true);
      module.addEventListener('dragover', (e) => e.preventDefault());
      module.addEventListener('dragleave', () => handleDragLeave(), true);
      module.addEventListener('drop', (e: DragEvent) => {
        if (e.dataTransfer.getData('pageModuleId') !== '') {
          copyPageModule({
            variables: {
              pageId,
              pageModuleId: e.dataTransfer.getData('pageModuleId'),
              createBelow: (e.target as HTMLElement).dataset.pageModuleId,
            },
          });
        } else {
          e.preventDefault();
          InsertNewModule(
            e.dataTransfer.getData('templateId'),
            (e.target as HTMLElement).dataset.pageModuleId,
          );
        }
      });
    });
  };

  return (
    <div>
      {previewLoading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 4,
            backgroundColor: '#fff',
          }}
        >
          <Loader />
        </div>
      )}
      {resizing && <DragOverlay />}
      {document.querySelector('iframe') &&
      document.querySelector('iframe').contentDocument.querySelector('body')
        ? document
            .querySelector('iframe')
            .contentDocument.querySelector('body')
            .classList.add('hoverActive')
        : ''}

      <iframe
        name="editor-preview"
        title="preview"
        id="preview_page"
        onLoad={() => {
          setPreviewLoading(false);
          handleIframeLoad(setPageModuleId);
        }}
        style={iframeStyle}
        frameBorder="0"
        width="100%"
        srcDoc={iframeContent}
      />
    </div>
  );
};

export default PreviewWindow;
