import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/MVMButton';
import { Link } from 'gatsby';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormContents = styled.div`
  margin: auto;
  height: 100%;
  text-align: center;
  h1 {
    font-size: 3rem;
    font-weight: 900;
  }
  form {
    display: flex;
    flex-direction: column;
    div {
      margin-bottom: 4%;
    }
  }
`;

const ChangePasswordForm = ({ resetToken }) => {
  const [resetDone, setResetDone] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
    }
    axios
      .post(`${process.env.GATSBY_API_URL}/api/reset_password`, {
        token: resetToken,
        password,
        passwordConfirmation,
      })
      .then((res) => {
        setResetDone(true);
      })
      .catch((err) => toast.error(err.response.data.error));
  };
  if (resetDone) {
    return (
      <>
        <p>Password was reset successfully.</p>
        <Link to="/login">
          <Button label="Go to Login" />
        </Link>
      </>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        label="Password"
      />
      <TextField
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        type="password"
        label="Confirm Password"
      />
      <div style={{ margin: 'auto' }}>
        <Button type="submit" label="Reset Password" submit buttonState="highlight" />
      </div>
    </form>
  );
};

const ResetPassword = (props) => {
  const [email, setEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.GATSBY_API_URL}/api/send_reset_email`, {
        email,
      })
      .then((res) => setResetEmailSent(true))
      .catch((err) => toast.error(err.response.data.error));
  };
  const resetToken = props.location.search.split('password_reset_token=')[1];

  return (
    <FormContents>
      <h1>Reset Password</h1>
      {resetToken ? (
        <ChangePasswordForm resetToken={resetToken} />
      ) : (
        <>
          {!resetEmailSent ? (
            <form onSubmit={handleSubmit}>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                label="Email"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/login">
                  <Button label="Back to Login" />
                </Link>
                <Button
                  type="submit"
                  label="Reset Password"
                  submit
                  buttonState="highlight"
                />
              </div>
            </form>
          ) : (
            <>
              <p>Password reset instructions have been sent to your email.</p>
              <Link to="/login">
                <Button label="Back to Login" />
              </Link>
            </>
          )}
        </>
      )}
    </FormContents>
  );
};

export default ResetPassword;
