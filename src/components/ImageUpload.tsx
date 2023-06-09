import React, { useState, FC } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import MVMImage from './MVMImage';

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Dropzone = styled.div`
  overflow: hidden;
  position: relative;

  &:hover {
    .overlay {
      cursor: pointer;
      display: flex;
    }
  }
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  display: none;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  p {
    margin: 0;
    padding: 0 1rem;
    font-weight: bold;
  }
`;

const ImageUploadContainer = styled.div`
  margin: 2rem 0;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

interface Props {
  // uploadEndpoint: string;
  uploadHandler?: (images) => void;
  handleSetFiles?: (files) => void;
  existingImageURL?: string;
}

const ImageUpload: FC<Props> = ({ uploadHandler, existingImageURL, children }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      if (uploadHandler) {
        const uploaded = await acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
        setFiles(uploaded);
        uploadHandler(uploaded);
      }
    },
  });

  if (children) {
    return (
      <Dropzone {...getRootProps({ className: 'dropzone' })}>
        <>
          {children} <input {...getInputProps()} />
        </>
      </Dropzone>
    );
  }

  return (
    <ImageContainer>
      <ImageUploadContainer className="container">
        <Dropzone {...getRootProps({ className: 'dropzone' })}>
          <Overlay className="overlay">
            <p>Click to upload new image</p>
          </Overlay>
          <input {...getInputProps()} />
          <>
            {files.length > 0 ? (
              <img src={files[0].preview} alt="template" />
            ) : (
              <MVMImage alt="templateImage" src={existingImageURL} />
            )}
          </>
        </Dropzone>
      </ImageUploadContainer>
    </ImageContainer>
  );
};
export default ImageUpload;
