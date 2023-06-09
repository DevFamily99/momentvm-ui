import React, { FC } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { Link } from 'gatsby';
import moment from 'moment';
import Image from '../MVMImage';
import { PageObj } from './types';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const PageWrapper = styled.div`
  width: 200px;
  font-size: 14px;
  transition: all 200ms ease;
  :hover {
    transform: translateY(-10px);
  }
`;

const PageName = styled.p`
  text-align: ${(props) => props.alignLabel || 'center'};
  margin-top: 0;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 3%;
`;

const ActivityLabel = styled.p`
  margin-top: 0;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 0;
`;

const ImageWrapper = styled.div`
  margin: 5%;
  img {
    border-radius: 5px;
    height: 160px;
    width: 100%;
  }
`;

interface Props {
  page: PageObj;
  alignLabel: string;
  openContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Page tile in the folder and home view
 */
export const Page: FC<Props> = ({
  page: { id, name, thumb, pageActivities = [] },
  alignLabel,
  openContextMenu,
}) => {
  let editedMsg;
  if (pageActivities.length) {
    const lastAcc = pageActivities[pageActivities.length - 1];
    if (lastAcc.user !== null) {
      editedMsg = `Last edited by ${lastAcc.user.email} ${moment(
        lastAcc.createdAt,
      ).fromNow()}`;
    }
  }

  return (
    <StyledLink to={`/pages/${id}`} onContextMenu={openContextMenu}>
      <PageWrapper>
        <ImageWrapper>
          <Image src={thumb} alt={name} />
        </ImageWrapper>
        <PageName alignLabel={alignLabel}>{name}</PageName>
        <ActivityLabel>{editedMsg}</ActivityLabel>
      </PageWrapper>
    </StyledLink>
  );
};

export const DraggablePage = (props) => {
  const [, drag] = useDrag({ item: { id: props.page.id, type: 'page' } });
  return (
    <div ref={drag} draggable>
      <Page {...props} />
    </div>
  );
};
