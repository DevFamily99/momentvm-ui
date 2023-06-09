import React from 'react';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { MenuItem, Select, InputLabel } from '@material-ui/core';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DirectionWrapper = styled.div`
  cursor: pointer;
`;

const Sort = ({ sortBy, setSortBy }) => {
  return (
    <Wrapper>
      <InputLabel id="sort-item">Sort by:</InputLabel>
      <Select labelId="sort-item" value={sortBy.order} onChange={e => setSortBy({ ...sortBy, order: e.target.value })}>
        <MenuItem value="updated_at"> Date Last Updated</MenuItem>
        <MenuItem value="created_at"> Date created</MenuItem>
        <MenuItem value="name">Name</MenuItem>
      </Select>
      <DirectionWrapper>
        {sortBy.direction === 'DESC' && (
          <ArrowDownwardIcon onClick={() => setSortBy({ ...sortBy, direction: 'ASC' })} />
        )}
        {sortBy.direction === 'ASC' && <ArrowUpwardIcon onClick={() => setSortBy({ ...sortBy, direction: 'DESC' })} />}
      </DirectionWrapper>
    </Wrapper>
  );
};

export default Sort;
