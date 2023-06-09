/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FunctionComponent } from 'react';
import Url from 'url-parse';
import styled from 'styled-components';
import Link from './Link';
import BlackLogo from '../../../images/m_logo_black.svg';
import arrowLeftSmall from '../../../images/arrowLeftSmall.svg';
import addModuleSmall from '../../../images/addModuleSmall.svg';
import reorderModuleSmall from '../../../images/reorderModuleSmall.svg';

const TopRow = styled.div`
  align-items: center;
  display: flex;
  & > div {
    flex-grow: 1;
  }
`;
const ReorderLink = styled.div``;

interface Props {
  setReorderListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewModuleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: FunctionComponent<Props> = ({
  setReorderListOpen,
  setNewModuleOpen,
}) => {
  const currentUrl = new Url(window.location.href);
  const urlSections = currentUrl.pathname.split('/');
  const pageId = urlSections[2];
  const host = currentUrl.origin;
  return (
    <TopRow>
      <BlackLogo />

      <Link image={arrowLeftSmall} to={`${host}/pages/${pageId}`}>
        Back to Page
      </Link>

      <ReorderLink
        onClick={() => {
          if (document.querySelectorAll('.module-form-container')[0]) {
            document.querySelectorAll('.module-form-container')[0].style.display = 'none';
          }
        }}
      >
        <Link
          image={addModuleSmall}
          func={() => {
            setNewModuleOpen(true);
            setReorderListOpen(false);
          }}
        >
          Add Module
        </Link>
      </ReorderLink>

      <ReorderLink
        onClick={() => {
          if (document.querySelectorAll('.module-form-container')[0]) {
            document.querySelectorAll('.module-form-container')[0].style.display = 'none';
          }
        }}
      >
        <Link
          image={reorderModuleSmall}
          func={() => {
            setReorderListOpen(true);
            setNewModuleOpen(false);
          }}
        >
          Reorder Modules
        </Link>
      </ReorderLink>
      <Link to={`/pages/${pageId}/default/view-only-live-preview`}>Preview</Link>
    </TopRow>
  );
};

export default Navigation;
