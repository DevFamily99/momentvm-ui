import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import Button from '../../components/MVMButton';
import UserForm from '../../components/UserForm';
import checkPermission from '../../utils/permission';

const GET_TEAM_USERS = gql`
  {
    team {
      id
      users {
        id
        email
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(input: { id: $id }) {
      user {
        id
      }
    }
  }
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  margin-bottom: 1vh;
`;

const ButtonWrapper = styled.div`
  min-width: 100%;
`;

const UserMail = styled.div`
  min-width: 20rem;
`;
const User = ({ user, setShowDialog, setUserId, deleteUser }) => (
  <UserWrapper>
    <UserMail>
      <p>{user.email}</p>
    </UserMail>
    <ButtonWrapper>
      <Button
        onClick={() => {
          setUserId(user.id);
          setShowDialog(true);
        }}
        label="Edit"
      />
      <Button label="Delete" buttonState="delete" onClick={() => deleteUser(user)} />
    </ButtonWrapper>
  </UserWrapper>
);

const Users = () => {
  if (!checkPermission('can_see_settings')) {
    window.location.href = '/';
    return null;
  }
  const [users, setUsers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const { refetch } = useQuery(GET_TEAM_USERS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setUsers(data.team.users),
  });
  const [deleteUser] = useMutation(DELETE_USER);

  const handleDeleteUser = async (user) => {
    if (confirm('Are you sure?')) {
      await deleteUser({ variables: { id: user.id } });
      refetch();
    }
  };
  return (
    <>
      <h1>Users</h1>
      <h4 style={{ marginBottom: 0 }}>Email</h4>
      {users.map((user) => (
        <User
          key={user.id}
          user={user}
          setUserId={setUserId}
          setShowDialog={setShowDialog}
          deleteUser={handleDeleteUser}
        />
      ))}
      {showDialog && (
        <UserForm
          id={userId}
          showDialog
          setShowDialog={setShowDialog}
          refetch={refetch}
        />
      )}
      <Button
        label="Invite New User"
        buttonState="highlight"
        onClick={() => {
          setUserId(null);
          setShowDialog(true);
        }}
      />
    </>
  );
};

export default Users;
