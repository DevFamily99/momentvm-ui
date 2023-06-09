import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import jwtDecode from 'jwt-decode';
import { gql, useMutation } from '@apollo/client';
import LogoOrange from '../images/M-orange.svg';
import ThunderSvg from '../images/thunder.svg';
import PagesSvg from '../images/pages.svg';
import ImagesSvg from '../images/images.svg';
import DevelopSvg from '../images/develop.svg';
import SettingsSvg from '../images/settings.svg';
import GuidesSvg from '../images/guides.svg';
import UsersSvg from '../images/users.svg';

const Wrapper = styled.div`
  background-color: #2b2f3e;
  color: #fff;
  background: linear-gradient(90deg, #1b113a 0%, #120832 100%);
  background-position: left;
  display: flex;
  flex-direction: column;
  padding-left: 3vw;
  align-items: flex-start;
  min-height: 100vh;
  margin-right: 4vw;
`;
const StyledLogo = styled(LogoOrange)`
  width: 70px;
  height: 70px;
  padding: 40px;
`;

const SidebarItems = styled.div`
  padding-right: 100px;
  svg {
    width: 28px;
    margin-right: 20px;
  }
`;

const SubItems = styled.div`
  margin-left: 50px;
  width: 100px;
  p {
    cursor: pointer;
    font-weight: 700;
  }
`;

const SidebarItem = styled.div`
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
  width: 130px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`;
const StyledExternalLink = styled.a`
  text-decoration: none;
  color: white;
`;

const CREATE_PAGE = gql`
  mutation CreatePage($pageFolderId: ID, $classic: Boolean) {
    createPage(input: { pageFolderId: $pageFolderId, classic: $classic }) {
      page {
        id
      }
    }
  }
`;

const Sidebar = () => {
  const jwt = localStorage.getItem('apiToken');
  const user = jwtDecode(jwt);
  const teamName = user.team_name;
  const appAdmin = user.app_admin;
  const [createPage] = useMutation(CREATE_PAGE);

  return (
    <Wrapper id="sidebar">
      <StyledLink to="/">
        <StyledLogo />
      </StyledLink>
      {/* <StyledLink to={user.skills.can_see_settings ? '/settings' : '#'}>
        <h4 id="sidebar_team_name">{teamName}</h4>
      </StyledLink> */}
      <SidebarItems>
        <SidebarItem>
          <ThunderSvg />
          <StyledLink to="/">
            <h3>Home</h3>
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <PagesSvg />
          <StyledLink to="/page_folders">
            <h3>Pages</h3>
          </StyledLink>
          <SubItems>
            <p
              hidden={!user.skills.can_create_pages}
              onClick={async () => {
                const { data } = await createPage({ variables: { classic: false } });
                if (window) {
                  window.location = `/pages/${data.createPage.page.id}`;
                }
              }}
            >
              New Page
            </p>
            <StyledLink to="/page_archive">
              <p>Archive</p>
            </StyledLink>
            <StyledLink to="/translation-projects">
              <p>Translation workflow</p>
            </StyledLink>
            <StyledLink to="/blueprint">
              <p>Blueprints</p>
            </StyledLink>
          </SubItems>
        </SidebarItem>
        <SidebarItem>
          <ImagesSvg />
          <StyledLink to="/assets">
            <h3>Images</h3>
          </StyledLink>
        </SidebarItem>
        <SidebarItem hidden={!user.skills.can_edit_templates}>
          <DevelopSvg />
          <StyledLink to="/templates">
            <h3>Develop</h3>
          </StyledLink>
        </SidebarItem>
        <SidebarItem hidden={!user.skills.can_see_settings}>
          <SettingsSvg />
          <StyledLink to="/settings">
            <h3>Settings</h3>
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <GuidesSvg />
          <StyledExternalLink href={`${process.env.GATSBY_DOCUMENTATION_URL}`}>
            <h3>How To</h3>
          </StyledExternalLink>
        </SidebarItem>
        {appAdmin && (
          <>
            <h3>APP Admin</h3>
            <SidebarItem>
              <UsersSvg />
              <StyledLink to="/admin/teams">
                <h3>Teams</h3>
              </StyledLink>
            </SidebarItem>
          </>
        )}
      </SidebarItems>
    </Wrapper>
  );
};

export default Sidebar;
