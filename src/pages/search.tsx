import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Image from '../components/MVMImage';

const GLOBAL_SEARCH = gql`
  query GlobalSearch($term: String!) {
    globalSearch(term: $term) {
      pages {
        id
        thumbnail
        name
      }
      assets {
        id
        thumbnail
        name
      }
    }
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 80px;
  svg {
    width: 80px !important;
  }
  img {
    width: 80px;
    max-height: -webkit-fill-available;
  }
  p {
    margin-left: 1rem;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    a {
      text-decoration: none;
      color: black;
    }
  }
  margin: 0.5rem;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  background-color: #2d2f46;
  padding: 0.5rem;
  border-radius: 3rem;
  min-width: 2rem;
  min-height: 2rem;
  color: #fff;
  font-weight: bolder;
`;

const SingleResult = ({ result }) => {
  console.log(result);
  const url =
    result.__typename === 'Page' ? `/pages/${result.id}` : `/media-files/${result.id}`;
  return (
    <ResultWrapper>
      <a href={url}>
        <Image src={result.thumbnail} alt={result.name} />
      </a>
      <p>
        <a href={url}>{result.name}</a>
      </p>
    </ResultWrapper>
  );
};

const Search = ({ location }) => {
  const [results, setResults] = useState({ pages: null, assets: null });
  const { loading } = useQuery(GLOBAL_SEARCH, {
    variables: { term: location.search.slice(3) },
    onCompleted: (data) => setResults(data.globalSearch),
  });

  return (
    <>
      <h1>Results</h1>
      {loading && <p>Fetching results...</p>}
      {results.pages && (
        <>
          <h2>Pages</h2>
          {results.pages.map((page) => (
            <SingleResult result={page} />
          ))}
        </>
      )}
      {results.assets && (
        <>
          <h2>Assets</h2>
          {results.assets.map((asset) => (
            <SingleResult result={asset} />
          ))}
        </>
      )}
      {!loading && results.assets === null && results.pages === null && (
        <>
          <p>No Pages or Images match your search.</p>
        </>
      )}
    </>
  );
};

export default Search;
