import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import Button from './MVMButton';
import UserForm from './UserForm';

const Wrapper = styled.div`
  width: 99%;
  display: flex;
  align-items: baseline;
`;

const NoStyleButton = styled.button`
  border: 0;
  background: 0;
  outline: none;
  cursor: pointer;
`;

const Header: React.FC = () => {
  const logout = () => {
    Cookies.remove('apiToken');
    if (window !== undefined) {
      window.location = '/login';
    }
  };
  const [showDialog, setShowDialog] = useState(false);

  const jwt = localStorage.getItem('apiToken');
  const user = jwtDecode(jwt);
  const teamName = user.team_name;
  const userId = user.user_id;
  const { email } = user;

  return (
    <Wrapper>
      <form style={{ width: '100%' }} action="/search" method="get">
        <TextField
          defaultValue={(() => {
            if (typeof window !== 'undefined') {
              return window.location.search.slice(3);
            }
            return '';
          })()}
          placeholder="Search..."
          name="q"
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <NoStyleButton>
                <SearchIcon />
              </NoStyleButton>
            ),
          }}
        />
      </form>
      <Button
        label={teamName}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location = '/settings';
          }
        }}
      />
      <Button label={email} onClick={() => setShowDialog(true)} />
      <Button label="Logout" onClick={() => logout()} />
      {showDialog && <UserForm id={userId} setShowDialog={setShowDialog} />}
    </Wrapper>
  );
};

export default Header;
