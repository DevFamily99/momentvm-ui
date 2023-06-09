import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { gql, useQuery, useMutation } from '@apollo/client';
import StyledTooltip from './styled/StyledTooltip';
import MVMDialog from './MVMDialog';

const GET_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $email: String!
    $password: String
    $passwordConfirmation: String
  ) {
    updateUser(
      input: {
        id: $id
        email: $email
        password: $password
        passwordConfirmation: $passwordConfirmation
      }
    ) {
      user {
        id
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(input: { email: $email }) {
      user {
        id
      }
    }
  }
`;

const InviteUser = ({ values, handleChange, errors }) => (
  <div>
    <StyledTooltip
      title="email already taken"
      open={!!errors.find((e) => e.field === 'email')}
    >
      <TextField
        value={values.email}
        onChange={handleChange}
        required
        name="email"
        label="Email"
        type="email"
        fullWidth
      />
    </StyledTooltip>
  </div>
);

const EditUser = ({ values, errors, handleChange }) => (
  <div>
    {console.log(errors)}
    <StyledTooltip
      title="email already taken"
      open={!!errors.find((e) => e.field === 'email')}
    >
      <TextField
        value={values.email}
        onChange={handleChange}
        required
        name="email"
        label="Email"
        type="email"
        fullWidth
      />
    </StyledTooltip>
    <TextField
      value={values.password}
      onChange={handleChange}
      name="password"
      label="Password"
      fullWidth
    />
    <StyledTooltip
      title={
        errors.find((e) => e.field === 'password_confirmation') &&
        errors.find((e) => e.field === 'password_confirmation').message
      }
      open={!!errors.find((e) => e.field === 'password_confirmation')}
    >
      <TextField
        value={values.passwordConfirmaiton}
        onChange={handleChange}
        name="passwordConfirmation"
        label="Confirm Password"
        fullWidth
      />
    </StyledTooltip>
  </div>
);

const UserForm = ({ id, setShowDialog, refetch }) => {
  const [values, setValues] = useState({
    id: null,
    email: '',
    password: '',
    passwordConfirmaiton: '',
  });
  const [title, setTitle] = useState('Invite User to Team');
  const [errors, setErrors] = useState([]);
  const [saveUser] = id ? useMutation(UPDATE_USER) : useMutation(CREATE_USER);
  useQuery(GET_USER, {
    variables: { id },
    skip: !id,
    onCompleted: (data) => (data ? setValues(data.user) : null),
  });

  useEffect(() => {
    if (id) {
      setTitle('Edit User');
    }
  }, [id]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors([]);
  };

  return (
    <MVMDialog
      showDialog={setShowDialog}
      title={title}
      content={
        id ? (
          <EditUser values={values} errors={errors} handleChange={handleChange} />
        ) : (
          <InviteUser values={values} errors={errors} handleChange={handleChange} />
        )
      }
      errors={errors}
      mutation={saveUser}
      mutationVariables={{ ...values }}
      setErrors={setErrors}
      refetch={refetch}
      submitButtonState="highlight"
      submitButtonLabel={id ? 'Save' : 'Invite'}
      successToast="Invite has been sent."
    />
  );
};
export default UserForm;
