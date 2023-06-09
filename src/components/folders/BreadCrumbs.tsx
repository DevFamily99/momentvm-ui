import React, { FC } from 'react';
import { Link } from '@reach/router';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import DropWrapper from './DropWrapper';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Breadcrumb = styled.div`
  display: flex;
`;

const Icon = styled.div`
  display: flex;
  margin: 0 0.2rem;

  svg {
    font-size: 1.2rem;
  }
`;

export interface Breadcrumb {
  id: string;
  name: string;
  path: string;
  __typename: string;
}

interface BreadcrumbsProps {
  breadcrumbs: [Breadcrumb];
  refetch: () => void;
  dnd: boolean;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs, refetch, dnd }) => {
  return (
    <div style={{ display: 'flex' }}>
      {breadcrumbs.map((folder, i) => {
        return (
          <Breadcrumb key={folder.id}>
            {dnd ? (
              <DropWrapper
                id={folder.id}
                folderType={folder.__typename}
                refetch={refetch}
              >
                <StyledLink to={folder.path}>{folder.name}</StyledLink>
              </DropWrapper>
            ) : (
              <StyledLink to={folder.path}>{folder.name}</StyledLink>
            )}
            <Icon>
              <ArrowForwardIosIcon />
            </Icon>
          </Breadcrumb>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
