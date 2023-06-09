import React from 'react';
import styled from 'styled-components';
import MVMButton from '../MVMButton';

const Pagination = styled.div`
  text-align: center;
  margin: 88px;
`;

const PaginationControlls = ({
  setPaginationOptions,
  perPageCount,
  paginationOptions: { hasNextPage, hasPreviousPage, startCursor, endCursor },
}) => {
  return (
    <Pagination>
      {hasPreviousPage && (
        <MVMButton
          onClick={() => setPaginationOptions({ last: perPageCount, before: startCursor })}
          label="Previous Page"
        />
      )}
      {hasNextPage && (
        <MVMButton onClick={() => setPaginationOptions({ first: perPageCount, after: endCursor })} label="Next Page" />
      )}
    </Pagination>
  );
};

export default PaginationControlls;
