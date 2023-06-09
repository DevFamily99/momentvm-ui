import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { DialogContentText } from '@material-ui/core';
import Button from '../MVMButton';
import StyledTooltip from '../styled/StyledTooltip';
import MVMDialog from '../MVMDialog';
import { CustomerGroupType, GetCustomerGroupsQueryResult } from './CustomerGroups';

export const DELETE_CUSTOMER_GROUP = gql`
  mutation DeleteCustomerGroup($id: ID!) {
    deleteCustomerGroup(input: { id: $id }) {
      customerGroup {
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

const CustomerGroupContainer = styled.div`
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

const Customer = styled.div`
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
  ) => Promise<ApolloQueryResult<GetCustomerGroupsQueryResult>>;
  customerGroup: CustomerGroupType;
  setCustomerGroup: React.Dispatch<React.SetStateAction<CustomerGroupType>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomerGroupComponent = ({
  customerGroup,
  setCustomerGroup,
  setNewModalOpen,
  refetch,
}: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomerGroup] = useMutation(DELETE_CUSTOMER_GROUP);

  const deleteDialogContent = () => {
    return (
      <DialogContentText id="alert-dialog-description">
        <span>
          Are you sure you want to delete customer group <b>{customerGroup.name}</b>?{' '}
        </span>{' '}
        <br />
        <span>This can break schedules that use this customer group.</span>
      </DialogContentText>
    );
  };

  return (
    <CustomerGroupContainer>
      <div>
        <StyledTooltip title={customerGroup.description}>
          <Title>{customerGroup.name}</Title>
        </StyledTooltip>
        <Button
          label="Edit"
          className="hidden_button"
          onClick={() => {
            setCustomerGroup(customerGroup);
            setNewModalOpen(true);
          }}
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
          title="Delete customer group?"
          successToast="Customer group was deleted successfully"
          content={deleteDialogContent()}
          mutation={deleteCustomerGroup}
          mutationVariables={{ id: customerGroup.id }}
          refetch={refetch}
          submitButtonLabel="Delete"
        />
      )}
    </CustomerGroupContainer>
  );
};
export default CustomerGroupComponent;
