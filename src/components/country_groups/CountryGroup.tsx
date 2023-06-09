import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { DialogContentText } from '@material-ui/core';
import Button from '../MVMButton';
import StyledTooltip from '../styled/StyledTooltip';
import MVMDialog from '../MVMDialog';
import { CountryGroupType, GetCountryGroupsQueryResult } from './CountryGroups';

export const DELETE_COUNTRY_GROUP = gql`
  mutation DeleteCountryGroup($id: ID!) {
    deleteCountryGroup(input: { id: $id }) {
      countryGroup {
        id
      }
    }
  }
`;

export const COPY_COUNTRY_GROUP = gql`
  mutation CopyCountryGroup($id: ID!) {
    copyCountryGroup(input: { id: $id }) {
      countryGroup {
        id
      }
    }
  }
`;

export interface Site {
  id: string;
  name: string;
  salesforceId: string;
  locales: Locale[];
}

const CountryGroupContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  max-width: 400px;
  flex-wrap: wrap;
  justify-content: space-between;
  &:hover .hidden_button {
    display: inline-flex !important;
  }
`;

const Country = styled.div`
  border-radius: 20px;
  padding: 0.7rem 0.9rem;
  margin: 5px;
  display: inline-flex;
  justify-content: center;
  font-weight: 600;
  color: #2c2a3b;
  background: #dfdfdf;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: inline-flex;
  width: fit-content;
  height: 40px;
  margin-right: 20px;
  padding: 6px;
`;

interface Props {
  refetch: (
    variables?: Record<string, any>,
  ) => Promise<ApolloQueryResult<GetCountryGroupsQueryResult>>;
  countryGroup: CountryGroupType;
  setCountryGroup: React.Dispatch<React.SetStateAction<CountryGroupType>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const CountryGroupComponent = ({
  countryGroup,
  setCountryGroup,
  setNewModalOpen,
  refetch,
}: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [deleteCountryGroup] = useMutation(DELETE_COUNTRY_GROUP);
  const [copyCountryGroup] = useMutation(COPY_COUNTRY_GROUP);

  const deleteDialogContent = () => {
    return (
      <DialogContentText id="alert-dialog-description">
        <span>
          Are you sure you want to delete country group <b>{countryGroup.name}</b>?{' '}
        </span>{' '}
        <br />
        <span>This can break schedules that use this country group.</span>
      </DialogContentText>
    );
  };

  const copyDialogContent = () => {
    return (
      <DialogContentText id="alert-dialog-description">
        <span>
          Are you sure you want to make a copy of country group <b>{countryGroup.name}</b>
          ?{' '}
        </span>{' '}
      </DialogContentText>
    );
  };

  return (
    <CountryGroupContainer>
      <div>
        <StyledTooltip title={countryGroup.description}>
          <Title>{countryGroup.name}</Title>
        </StyledTooltip>
        <Button
          label="Edit"
          className="hidden_button"
          onClick={() => {
            setCountryGroup(countryGroup);
            setNewModalOpen(true);
          }}
        />
        <Button
          label="Copy"
          className="hidden_button"
          onClick={() => setCopyModalOpen(true)}
        />
        <Button
          label="Delete"
          buttonState="delete"
          className="hidden_button"
          onClick={() => {
            setDeleteModalOpen(true);
          }}
        />
      </div>
      {deleteModalOpen && (
        <MVMDialog
          showDialog={setDeleteModalOpen}
          title="Delete country group?"
          successToast="Country group was deleted successfully"
          content={deleteDialogContent()}
          mutation={deleteCountryGroup}
          mutationVariables={{ id: countryGroup.id }}
          refetch={refetch}
          submitButtonLabel="Delete"
        />
      )}
      {copyModalOpen && (
        <MVMDialog
          showDialog={setCopyModalOpen}
          title="Copy country group?"
          successToast="Country group was copied successfully"
          content={copyDialogContent()}
          mutation={copyCountryGroup}
          mutationVariables={{ id: countryGroup.id }}
          refetch={refetch}
          submitButtonLabel="Copy"
        />
      )}
      <div>
        {countryGroup.sites.map((site) => (
          <StyledTooltip
            arrow
            key={site.id}
            title={
              <>
                {site.locales.map((locale) => (
                  <div key={locale.code}>
                    {locale.displayName} ({locale.code})
                  </div>
                ))}
              </>
            }
          >
            <Country>{site.salesforceId}</Country>
          </StyledTooltip>
        ))}
      </div>
    </CountryGroupContainer>
  );
};
export default CountryGroupComponent;
