import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { parseISO } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import { useMutation } from '@apollo/client';
import Button from '../../MVMButton';
import DeleteSchedule from './DeleteSchedule';
import SchedulePublish from './SchedulePublish';
import EditButton from './EditButton';
import MVMPickerDialog from '../../MVMPickerDialog';
import EndAtIcon from '../../../images/end.svg';
import StartAtIcon from '../../../images/right.svg';
import {
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  DELETE_COUNTRY_GROUP_REFERENCE,
  GET_SCHEDULE,
  GET_COUNTRY_GROUPS,
  GET_CUSTOMER_GROUPS,
  DELETE_CUSTOMER_GROUP_REFERENCE,
} from '../../../utils/queries';
import EditableInput from '../../MVMEditableInput';

const ActionsWrapper = styled.div`
  margin-bottom: 15px;
  margin-top: 63px;
`;

const FormWrapper = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
`;

const DateFieldWrapper = styled.div`
  display: flex;
  margin: 10px;
`;

const Svg = styled.img`
  margin-right: 5%;
`;
const CountryGroupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  button: {
    margin-right: 10px;
  }

  .mvm-button {
    margin: 0.3rem 0;
  }
`;

const TopActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
`;

const CampaignName = styled.div`
  display: flex;
  margin-bottom: 1rem;

  .mvm-editable-input {
    min-width: 10rem;
    margin-left: 1rem;
  }
`;

const CustomerGroupsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  button: {
    margin-right: 10px;
  }

  .mvm-button {
    margin: 0.5rem 0;
  }
`;

const DatePickerClearWrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding-left: 10px;
`;

const ScheduleForm = ({ page, schedule, refetch }) => {
  const [addCountryGroupOpen, setAddCountryGroupOpen] = useState(false);
  const [addCustomerGroupOpen, setAddCustomerGroupOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // These are ISO date strings, NOT DATE OBJECTS!!!
  const [startDate, setStartDate] = useState(schedule.startAt);
  const [endDate, setEndDate] = useState(schedule.endAt);

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE);
  const [deleteCountryGroupScheduleReference] = useMutation(
    DELETE_COUNTRY_GROUP_REFERENCE,
    {
      refetchQueries: [{ query: GET_SCHEDULE, variables: { id: schedule.id } }],
    },
  );
  const [deleteCustomerGroupScheduleReference] = useMutation(
    DELETE_CUSTOMER_GROUP_REFERENCE,
    {
      refetchQueries: [{ query: GET_SCHEDULE, variables: { id: schedule.id } }],
    },
  );
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateSchedule({
        variables: {
          id: schedule.id,
          startAt: startDate,
          endAt: endDate,
        },
      });
    }
  }, [startDate, endDate]);

  return (
    <FormWrapper>
      {deleteModalOpen && (
        <DeleteSchedule
          setDeleteModalOpen={setDeleteModalOpen}
          deleteSchedule={deleteSchedule}
          schedule={schedule}
          refetch={refetch}
        />
      )}

      {addCountryGroupOpen && (
        <MVMPickerDialog
          showDialog={setAddCountryGroupOpen}
          update={updateSchedule}
          target={schedule}
          targetItems={schedule.countryGroups}
          refetch={refetch}
          query={GET_COUNTRY_GROUPS}
          itemName="country groups"
          itemVariableName="countryGroups"
          dialogTitle="Select a country group to add"
          createNewItemPath="/settings/country-groups"
        />
      )}
      <TopActions>
        {addCustomerGroupOpen && (
          <MVMPickerDialog
            showDialog={setAddCustomerGroupOpen}
            update={updateSchedule}
            target={schedule}
            targetItems={schedule.customerGroups}
            refetch={refetch}
            query={GET_CUSTOMER_GROUPS}
            itemName="customer groups"
            itemVariableName="customerGroups"
            dialogTitle="Select a customer group to add"
            createNewItemPath="/settings/customer-groups"
          />
        )}
        {schedule.published ? (
          <Button label="Live" leadingIcon="check" />
        ) : (
          <SchedulePublish schedule={schedule} pageContext={page.pageContext} />
        )}
        <EditButton schedule={schedule} />
      </TopActions>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateFieldWrapper>
          <StartAtIcon width="25" />
          <DatePickerClearWrapper>
            <KeyboardDateTimePicker
              clearable
              format="dd.MM.yyyy (E) HH:mm"
              placeholder="Start"
              value={startDate && parseISO(startDate)}
              onChange={(date) => {
                if (date) {
                  setStartDate(date.toISOString());
                  return;
                }
                setStartDate(date);
              }}
            />
          </DatePickerClearWrapper>
        </DateFieldWrapper>
        <DateFieldWrapper>
          <EndAtIcon width="25" />
          <DatePickerClearWrapper>
            <KeyboardDateTimePicker
              disablePast
              clearable
              format="dd.MM.yyyy (E) HH:mm"
              placeholder="End"
              value={endDate && parseISO(endDate)}
              onChange={(date) => {
                if (date) {
                  setEndDate(date.toISOString());
                  return;
                }
                setEndDate(date);
              }}
            />
          </DatePickerClearWrapper>
        </DateFieldWrapper>
      </MuiPickersUtilsProvider>
      <CountryGroupContainer>
        {schedule.countryGroups.map((cg) => (
          <Button
            label={cg.name}
            key={cg.id}
            aria-label="edit"
            trailingIcon="close"
            onClick={() => {
              deleteCountryGroupScheduleReference({
                variables: {
                  scheduleID: schedule.id,
                  countryGroupID: cg.id,
                },
              });
            }}
          />
        ))}

        <Button
          label="Add country group"
          onClick={() => {
            setAddCountryGroupOpen(true);
          }}
          leadingIcon="add"
        />
      </CountryGroupContainer>
      <CustomerGroupsContainer>
        {schedule.customerGroups.map((cg) => (
          <Button
            label={cg.name}
            key={cg.id}
            aria-label="edit"
            trailingIcon="close"
            onClick={() => {
              deleteCustomerGroupScheduleReference({
                variables: {
                  scheduleID: schedule.id,
                  customerGroupID: cg.id,
                },
              });
            }}
          />
        ))}
        <Button
          label="Add customer group"
          onClick={() => {
            setAddCustomerGroupOpen(true);
          }}
          leadingIcon="add"
        />
      </CustomerGroupsContainer>
      <CampaignName>
        Campaign ID:
        <EditableInput
          value={schedule.campaignId}
          mutation={updateSchedule}
          mutationVariables={{
            id: Number(schedule.id),
          }}
          mutationUpdateParam="campaignId"
          size="small"
        />
      </CampaignName>
      <ActionsWrapper>
        <Button
          label=""
          onClick={() => {
            setDeleteModalOpen(true);
          }}
          buttonState="delete"
          leadingIcon="delete"
        />
      </ActionsWrapper>
    </FormWrapper>
  );
};

export default ScheduleForm;
