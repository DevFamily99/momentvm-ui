import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import {
  CREATE_SCHEDULE,
  GET_PAGE,
  GET_SCHEDULES_FOR_PAGE,
} from '../../../utils/queries';
import * as Types from '../../../types';
import AddIcon from '../../../images/add.svg';

const Button = styled.a`
  corner-radius: 50px;
  width: 40;
  height: 40px;
  background: white;
  margin: 5px;
  cursor: pointer;
`;

interface NewScheduleButtonProps {
  page: Types.Page;
}

/**
 * Uses apollo to create a new page
 * @param page A Page
 */
const NewScheduleButton = ({ page }: NewScheduleButtonProps) => {
  // console.log(page);
  return (
    <Mutation
      mutation={CREATE_SCHEDULE}
      variables={{ pageId: page.id }}
      refetchQueries={[
        {
          query: GET_PAGE,
          variables: { id: page.id },
        },
      ]}
    >
      {(newSchedule) => (
        <Button onClick={newSchedule}>
          <AddIcon />
        </Button>
      )}
    </Mutation>
  );
};

export default NewScheduleButton;
