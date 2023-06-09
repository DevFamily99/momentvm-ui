import React from 'react';
import styled from 'styled-components';
import '../styles/global.css';
import { ToastContainer } from 'react-toastify';
import LogoOrange from '../images/M-orange.svg';
import 'react-toastify/dist/ReactToastify.css';

const Background = styled.div`
  height: 100vh;
  width: 100%;
  background: url(/colorsplash.jpg);
  background-size: cover;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const LogoContainer = styled.div`
  margin: 60px;
  padding-bottom: 100px;
  position: absolute;
  @media screen and (max-width: 768px) {
    position: relative;
    width: 100%;
    text-align: center;
    margin-bottom: -200px;
  }
`;

const FormContainer = styled.div`
  background: white;
  margin: auto;
  min-width: fit-content;
  width: 16%;
  /* height: 40%; */
  padding: 30px;
  border-radius: 10%;
  display: flex;
`;

const PublicLayout = ({ children }) => {
  return (
    <Background>
      <LogoContainer>
        <LogoOrange />
      </LogoContainer>
      <FormContainer>{children}</FormContainer>
      <ToastContainer />
    </Background>
  );
};

export default PublicLayout;
