import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GET_PAGES } from '../../../../utils/queries';
import useDebounce from '../../../../hooks/debounceHook';
import Image from '../../../MVMImage';

const PageSearchInputField = {
  color: 'rgba(0, 0, 0, 0.87)',
  borderRadius: '0.28571429rem',
  background: '#f3f3f3',
};

const PageSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageSearchInputCloseHolder = styled.div`
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: baseline;
`;

const PageSearchResultContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
`;

const PageSingleResultContainer = styled.div`
  align-items: center;
  font-size: 0.8rem;
  max-width: 220px;
  min-width: 220px;
  max-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: min-content;
`;

const ImageDescription = styled.div`
  padding: 1rem;
  text-align: center;
`;

const PageImageWrapper = styled.div`
  margin: 5%;
  img {
    height: 150px;
    width: 200px;
    background-color: 'grey';
    border-radius: '5px';
  }
`;

const PageSearch = ({ next }) => {
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deboucedSearchTerm = useDebounce(searchTerm, 300);
  useQuery(GET_PAGES, { variables: { searchTerm: deboucedSearchTerm }, onCompleted: data => setPages(data.pages) });

  return (
    <PageSearchContainer>
      <PageSearchInputCloseHolder>
        <TextField
          id="page-searchbar"
          style={PageSearchInputField}
          placeholder="Search pages..."
          inputProps={{ 'aria-label': 'search pages' }}
          onChange={e => setSearchTerm(e.target.value)}
          fullWidth
        />
      </PageSearchInputCloseHolder>

      <PageSearchResultContainer>
        {pages.map(page => (
          <PageSingleResultContainer
            key={page.id}
            onClick={() => next(page)}
            onKeyPress={next}
            role="button"
            tabIndex={0}
          >
            <PageImageWrapper>
              <Image src={page.thumb} alt={page.name} />
            </PageImageWrapper>
            <ImageDescription>{page.name}</ImageDescription>
          </PageSingleResultContainer>
        ))}
      </PageSearchResultContainer>
    </PageSearchContainer>
  );
};

export default PageSearch;
