import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import CloseButton from '../../CloseButton';
import {
  GET_ROLES,
  GET_ROLE_WHITELIST,
  UPDATE_ROLE_WHITELIST,
} from '../../../utils/queries';
import StyledCheckbox from '../../styled/StyledCheckbox';

const Permissions = ({ pageModuleId, setPermissionsOpen }) => {
  const [roles, setRoles] = useState([]);
  const [roleWhitelist, setRoleWhitelist] = useState([]);

  useQuery(GET_ROLES, {
    onCompleted: (data) => setRoles(data.roles),
  });
  const { refetch: refetchRoleWhitelist } = useQuery(GET_ROLE_WHITELIST, {
    variables: {
      pageModuleId,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setRoleWhitelist(data.roleWhitelist),
  });
  const [updateRoleWhitelist] = useMutation(UPDATE_ROLE_WHITELIST);

  const handleInput = async (role) => {
    if (role.body.can_edit_all_modules_by_default === 'yes') {
      toast.error('This is a global setting, it can not be changed from here.');
      return;
    }
    const { data } = await updateRoleWhitelist({
      variables: { pageModuleId, roleId: role.id },
    });
    await refetchRoleWhitelist();
    if (data) {
      setRoleWhitelist(data.updateRoleWhitelist.roleWhitelist);
      toast.success('Permissions updated.');
    }
  };

  return (
    <Dialog open onClose={() => setPermissionsOpen(false)}>
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ marginRight: '60px' }}>
            Give a user group permissions for this module
          </p>
          <CloseButton func={() => setPermissionsOpen(false)} />
        </div>
      </DialogTitle>

      <DialogContent>
        {roles.map((role) => (
          <div key={role.id}>
            <StyledCheckbox
              checked={
                roleWhitelist.map((w) => w.roleId).includes(role.id) ||
                role.body.can_edit_all_modules_by_default === 'yes'
              }
              onChange={() => handleInput(role)}
            />
            {role.name}
            <br />
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default Permissions;
