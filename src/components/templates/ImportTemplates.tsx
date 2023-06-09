import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import MVMButton from '../MVMButton';

const Dropzone = styled.div`
  width: 400px;
  height: 300px;
  border: 1px dashed grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImportTemplates = ({ showImportTemplates, refetchTemplates }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.zip',
    onDropAccepted: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      axios
        .post(`${process.env.GATSBY_API_URL}/api/templates/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            apiToken: localStorage.getItem('apiToken'),
          },
        })
        .then((res) => {
          refetchTemplates();
          showImportTemplates(false);
          toast.success(res.data.message);
        })
        .catch((e) => {
          if (e.response) {
            toast.error(e.response.data.message);
          } else {
            toast.error(e.message);
          }
        });
    },
    onDropRejected: () => toast.error('Please only upload zip files'),
  });

  return (
    <Dialog open onClose={() => showImportTemplates(false)}>
      <DialogTitle>Import Templates</DialogTitle>
      <DialogContent>
        <Dropzone {...getRootProps({ className: 'dropzone' })}>
          <p>Click or drop files here to upload them</p>

          <input {...getInputProps()} />
        </Dropzone>
      </DialogContent>
      <DialogActions>
        <MVMButton label="Close" onClick={() => showImportTemplates(false)} />
      </DialogActions>
    </Dialog>
  );
};

export default ImportTemplates;
