import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Dialog } from '@material-ui/core';
import styled from 'styled-components';
import { format } from 'date-fns';
import { GET_SCHEDULES_FOR_PAGE, UPDATE_SCHEDULE } from '../../../utils/queries';
import StyledCheckbox from '../../styled/StyledCheckbox';
import Button from '../../Button';

const Wrapper = styled.div`
  font-family: Nunito Sans, sans-serif;
  margin: 50px;
`;

const Nav = styled.div`
  display: flex;
`;

const Schedule = styled.div`
  margin: auto;
  border: solid grey 1px;
  border-radius: 5px;
  margin-top: 20px;
  display: flex;
`;
const CheckBoxContainer = styled.div`
  flex: 1;
  text-align: center;
  padding: 60px 0;
`;

const ScheduleContent = styled.div`
  flex: 3;
  margin: 10px;
`;

const Title = styled.h2`
  margin: 10px;
`;

const Schedules = ({ pageModuleId, setSchedulesOpen }) => {
  const pageId = window.location.href.split('/')[4];
  const { data, error, loading, refetch } = useQuery(GET_SCHEDULES_FOR_PAGE, {
    variables: { page: parseInt(pageId, 10) },
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);

  const handleChandeCheckBox = async (e, pageModuleId, schedule) => {
    const { checked } = e.target;
    const updateData = {};
    updateData.id = schedule.id;
    updateData.pageModules = schedule.pageModules.map((pm) => pm.id);
    if (checked) {
      updateData.pageModules.push(pageModuleId);
    } else {
      updateData.pageModules = updateData.pageModules.filter((m) => m !== pageModuleId);
    }
    await updateSchedule({
      variables: { id: updateData.id, pageModuleIds: updateData.pageModules },
    });
    refetch();
  };

  const formatDate = (date) => {
    if (!date) return 'Not Set';
    return format(new Date(date), 'dd-MM-yyyy', {
      awareOfUnicodeTokens: true,
    });
  };

  return (
    <Dialog open onClose={() => setSchedulesOpen(false)}>
      <Wrapper>
        <Nav>
          <Title>Module is assigned to these schedules</Title>
          <Button
            style={{ margin: '7px 0 0 30px' }}
            type="button"
            onClick={() => setSchedulesOpen(false)}
          >
            Close
          </Button>
        </Nav>
        {error ? `Error!:${error}` : null}
        {loading
          ? 'Loading...'
          : data.schedules.map((s) => (
              <Schedule id={`schedule-${s.id}`} key={s.id}>
                <CheckBoxContainer>
                  <StyledCheckbox
                    onChange={(e) => handleChandeCheckBox(e, pageModuleId, s)}
                    checked={s.pageModules.map((pm) => pm.id).includes(pageModuleId)}
                  />
                </CheckBoxContainer>
                <ScheduleContent>
                  <h3>ID: {s.id}</h3>
                  <p>Start From: {formatDate(s.startAt)}</p>
                  <p>Ends At: {formatDate(s.endAt)}</p>

                  <div>
                    <p>Country Groups: </p>
                    {s.countryGroups.map((cg) => (
                      <p key={cg.id}>{cg.name}</p>
                    ))}
                  </div>
                </ScheduleContent>
              </Schedule>
            ))}
      </Wrapper>
    </Dialog>
  );
};
export default Schedules;
