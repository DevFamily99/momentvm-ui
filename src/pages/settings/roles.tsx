import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Button from '../../components/MVMButton';
import RoleForm from '../../components/RoleForm';
import checkPermission from '../../utils/permission';

const GET_TEAM_ROLES = gql`
  {
    team {
      id
      users {
        id
        email
      }
      roles {
        id
        name
        body
        canCreatePages
        canEditPages
        canApprovePages
        canSeeAdvancedMenu
        canEditTemplates
        canSeeLanguagePreview
        canSeeCountryPreview
        canUnpublishPages
        canPublishPages
        canEditSettings
        canSeeSettings
        canEditAllModulesByDefault
        canEditModulePermissions
        canCopyModules
        canDuplicatePage
        users {
          id
          email
        }
      }
    }
    allSkills
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(input: { id: $id }) {
      role {
        id
      }
    }
  }
`;

const RoleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
`;

const Role = ({ role, setShowDialog, deleteRole, setRoleId }) => (
  <RoleWrapper>
    <p data-role-id={role.id}>{role.name}</p>
    <div>
      <Button
        onClick={() => {
          setRoleId(role.id);
          setShowDialog(true);
        }}
        label="Edit"
      />
      <Button label="Delete" buttonState="delete" onClick={() => deleteRole(role.id)} />
    </div>
  </RoleWrapper>
);

const Roles = () => {
  if (!checkPermission('can_see_settings')) {
    navigate('/');
    return null;
  }
  const [roles, setRoles] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const { refetch, data } = useQuery(GET_TEAM_ROLES, {
    onCompleted: (data) => setRoles(data.team.roles),
    notifyOnNetworkStatusChange: true,
  });
  const [deleteRole] = useMutation(DELETE_ROLE);
  const handleDelete = async (roleId) => {
    if (confirm('Are you sure?')) {
      await deleteRole({ variables: { id: roleId } });
      refetch();
    }
  };
  return (
    <>
      <h1>Roles</h1>
      <h4 style={{ marginBottom: 0 }}>Name</h4>

      {roles.map((role) => (
        <Role
          role={role}
          setRoleId={setRoleId}
          deleteRole={handleDelete}
          setShowDialog={setShowDialog}
        />
      ))}
      {showDialog && (
        <RoleForm
          allSkills={data.allSkills}
          users={data.team.users}
          role={roles.find((r) => r.id === roleId)}
          setNewModalOpen={setShowDialog}
          refetch={refetch}
        />
      )}
      <Button
        label="Create New Role"
        buttonState="highlight"
        onClick={() => {
          setRoleId(null);
          setShowDialog(true);
        }}
      />
    </>
  );
};

export default Roles;
