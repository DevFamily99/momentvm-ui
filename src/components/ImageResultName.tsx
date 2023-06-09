import React, { Fragment } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const textTruncate = (str, length = 100, ending = '...') => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

const ImageLabel = styled.p`
  text-align: center;
  margin: 10px;
  font-family: 'Nunito Sans', sans-serif;
`;

const ImageResultName = ({ name }) => {
  // some filenames have very long with underscores so there have to be word breaks for them
  if (name.includes('_')) {
    const chunks = name.split('_');
    const lastChunk = chunks[chunks.length - 1];
    const nameWithBreaks = chunks.map((chunk) => {
      if (chunk === lastChunk) {
        return <Fragment key={uuidv4()}>{chunk}</Fragment>;
      }
      return (
        <Fragment key={uuidv4()}>
          {chunk}
          _
          <wbr />
        </Fragment>
      );
    });
    return <ImageLabel>{nameWithBreaks}</ImageLabel>;
  }
  if (!name.includes('_') && !name.includes('-') && !name.includes(' ')) {
    return <ImageLabel>{textTruncate(name, 28)} </ImageLabel>;
  }
  return <ImageLabel>{name}</ImageLabel>;
};

export default ImageResultName;
