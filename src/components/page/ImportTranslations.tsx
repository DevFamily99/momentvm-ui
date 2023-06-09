import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';
import MVMButton from '../MVMButton';

const Dropzone = styled.div`
  width: 400px;
  height: 300px;
  border: 1px dashed grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImportTranslations = ({ setImportTranslationsOpen, pageId }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    onDropAccepted: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      axios
        .post(
          `${process.env.GATSBY_API_URL}/api/pages/${pageId}/import_translations`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              apiToken: localStorage.getItem('apiToken'),
            },
          },
        )
        .then((res) => {
          setImportTranslationsOpen(false);
          toast.success(res.data.message);
        })
        .catch((e) => {
          if (e.response) {
            toast.error(e.response.data.message);
          } else {
            toast.error(e.message);
          }
        });
      toast.info('Processing translations. Please wait a moment.');
    },
    onDropRejected: () => toast.error('Please only upload csv files'),
  });

  return (
    <Dialog open onClose={() => setImportTranslationsOpen(false)}>
      <DialogTitle>Import Translations</DialogTitle>
      <DialogContent>
        <Dropzone {...getRootProps({ className: 'dropzone' })}>
          <p>Click or drop files here to upload them</p>

          <input {...getInputProps()} />
        </Dropzone>
      </DialogContent>
      <DialogActions>
        <MVMButton label="Close" onClick={() => setImportTranslationsOpen(false)} />
      </DialogActions>
    </Dialog>
  );
};

export default ImportTranslations;
