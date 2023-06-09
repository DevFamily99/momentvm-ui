import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextField, Tooltip } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { GET_PAGES } from '../utils/queries';
import MVMImage from './MVMImage';
import { Page, GetPagesResponse } from '../types';
import useDebounce from '../hooks/debounceHook';
import MVMPageSwitch from './MVMPageSwitch';
const Containter = styled.div``;

const Tile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0px;
  background-color: ${props => (props.selected ? '#d8d8d8' : 'none')};
  -webkit-box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  padding: 10px;
  border-radius: 15px;
  gap: 10px;
`;

const TileText = styled.a`
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
  flex-basis: 65%; 
  display: block;
  text-align: left;
`;

const TileImage = styled.div`
  width: 100px;
  height: 100px;
  img {
    width: 100px;
    height: 140px;
    border-radius: 100px;
  }
`;

interface PageSearchProps {
  maxResults: number;
  selectable?: boolean;
  selected?: [Page];
  setSelected?: () => void;
}

/**
 * Page search using apollo hooks
 * TODO the page tiles shold be a seperate component
 * @param PageSearchProps
 */
const PageSearch: FC<PageSearchProps> = ({
  maxResults,
  selectable,
  selected,
  setSelected,
}) => {
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, fetchMore } = useQuery(GET_PAGES, {
    variables: { maxResults },
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMore({
        variables: { searchTerm: debouncedSearchTerm },
        updateQuery: (previousResult: GetPagesResponse, { fetchMoreResult }) => {
          const pinedPages = pages.filter((page) => selected.includes(page.id));
          const newResults = fetchMoreResult.pages.filter(
            (page) => !selected.includes(page.id),
          );
          setPages([...pinedPages, ...newResults]);
          return fetchMoreResult;
        },
      });
    }
  }, [debouncedSearchTerm]);

  if (error) return <p>Error fetching pages</p>;
  if (!loading && !pages.length) {
    setPages(data.pages);
  }

  return (
    <Containter>
      <TextField
        fullWidth
        placeholder="Search for a page by name or id"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && 'Loading'}
      {!loading &&
        pages.map(page => (        
          <div key={page.id} >
            <Tile selected={new Set(selected).has(page.id)}>
              <TileImage>
                <MVMImage src={page.thumb} alt={page.name} />
              </TileImage>
              <Tooltip title={page.name} placement="top">
                <TileText target="_blank" href={`/pages/${page.id}`}>
                  { page.name.length > 20 ? page.name.substring(0,20) + "..." : page.name }
                </TileText>
              </Tooltip>
              {  selectable && <MVMPageSwitch
                  isOn={new Set(selected).has(parseInt(page.id))}
                  value={parseInt(page.id)}
                  handleToggle={(id) => setSelected(id)}  />
              }
            </Tile>
          </div>
        ))}
    </Containter>
  );
};

export default PageSearch;
