import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { TextField, withStyles } from '@material-ui/core';
import StyledTooltip from '../styled/StyledTooltip';
import MVMDialog from '../MVMDialog';
import { CustomerGroup } from '../../types';

const UPDATE_CUSTOMER_GROUP = gql`
  mutation UpdateCustomerGroup($id: ID!, $name: String!) {
    updateCustomerGroup(input: { id: $id, name: $name }) {
      customerGroup {
        id
        name
      }
    }
  }
`;
const CREATE_CUSTOMER_GROUP = gql`
  mutation CreateCustomerGroup($name: String!) {
    createCustomerGroup(input: { name: $name }) {
      customerGroup {
        id
        name
      }
    }
  }
`;

const CustomerGroupWrapper = styled.div`
  height: 20rem;
`;

const StyledTextField = withStyles({
  root: {
    width: '100%',
    marginBottom: '10%',
  },
})(TextField);

interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerGroup?: CustomerGroup;
}

const CustomerGroupForm = ({ customerGroup, setNewModalOpen, refetch }: Props) => {
  const [values, setValues] = useState({ id: null, name: '' });
  const [errors, setErrors] = useState([]);
  const [saveCustomerGroup] = customerGroup
    ? useMutation(UPDATE_CUSTOMER_GROUP)
    : useMutation(CREATE_CUSTOMER_GROUP);
  const [title, setTitle] = useState('New customer group');

  const handleChange = ({ target: { name, value } }) => {
    setErrors([]);
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };

  useEffect(() => {
    if (customerGroup) {
      setTitle('Edit country group');
      if (Object.keys(customerGroup).length > 0) {
        setValues({
          id: customerGroup.id,
          name: customerGroup.name,
        });
      }
    }
  }, []);

  const dialogContent = (values, errors, handleChange) => {
    return (
      <CustomerGroupWrapper>
        <StyledTooltip
          title="name already taken"
          open={!!errors.find((e) => e.field === 'name')}
        >
          <StyledTextField
            value={values.name}
            onChange={handleChange}
            required
            name="name"
            label="Name"
          />
        </StyledTooltip>
      </CustomerGroupWrapper>
    );
  };

  return (
    <MVMDialog
      showDialog={setNewModalOpen}
      title={title}
      content={dialogContent(values, errors, handleChange)}
      mutation={saveCustomerGroup}
      mutationVariables={{ ...values }}
      refetch={refetch}
      errors={errors}
      setErrors={setErrors}
      submitButtonState={values.name ? 'highlight' : 'disabled'}
    />
  );
};

export default CustomerGroupForm;
