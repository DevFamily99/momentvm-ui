/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { navigate } from 'gatsby';
import { createTheme, ThemeProvider } from '@material-ui/core';
import authorized from '../utils/auth';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Header from './Header';
import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

const Main = styled.main`
  display: flex;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin-top:0.5rem;
`;
const FlexWrapper = styled.div`
  flex: 1;
`;

const Layout = ({ children }) => {
  let theme = createTheme();
  theme = createTheme({
    palette: {
      primary: {
        main: '#1b033c',
      },
    },
  });
  const apiToken = authorized();
  useEffect(() => {
    if (!apiToken) {
      navigate('/login');
    }
  }, []);
  // Also null when not loaded yet from localStorage
  if (!apiToken) {
    return <></>;
  }

  return (
    <Main>
      <ThemeProvider theme={theme}>
        <Sidebar />
        <Content id="maincontent">
          <Header />
          <FlexWrapper>{children}</FlexWrapper>
          <Footer version="6.0" />
        </Content>
        <ToastContainer />
      </ThemeProvider>
    </Main>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
