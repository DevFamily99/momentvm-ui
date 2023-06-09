import React, { useState } from 'react';
import styled from 'styled-components';
import '../styles/global.css';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, navigate } from 'gatsby';
import Button from '../components/MVMButton';

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
const LoginBtn = styled(Button)`
  width: -webkit-fill-available !important;
  div {
    width: -webkit-fill-available;
    div {
      margin: auto;
    }
  }
`;

const BtnWrapper = styled.button`
  outline: none;
  border: none;
  background: none;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      return;
    }
    axios
      .post(`${process.env.GATSBY_API_URL}/api/login`, { email, password })
      .then((res) => {
        // set a cookie with the token from the api
        // redirect to the dashboard
        localStorage.setItem('apiToken', res.data.token);
        navigate('/');
      })
      .catch((e) => {
        if (e.response) {
          toast.error(e.response.data.error);
        } else {
          toast.error(e.message);
        }
      });
  };

  return (
    <FormContents>
      <h1>Please Login</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          label="Email"
          type="text"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="on"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <BtnWrapper type="submit">
          <LoginBtn label="Login" buttonState="highlight" />
        </BtnWrapper>
        <div>
          <Link to="/team-signup">
            <Button label="Team Signup" />
          </Link>
          <Link to="/reset-password">
            <Button label="Reset Password" />
          </Link>
        </div>
      </form>
    </FormContents>
  );
};

export default Login;
