import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { useDrag } from 'react-dnd';
import FolderSvg from '../../images/folder.svg';
import { FolderElement } from './types';
import DropWrapper from './DropWrapper';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const FolderWrapper = styled.div`
  height: 200px;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: ${(props) => (props.hover ? 'lightblue' : 'none')};
  svg {
    height: 78px;
    margin: auto;
  }
`;

const FolderName = styled.p`
  margin-top: 20px;
`;

interface Props {
  folder: FolderElement;
  openContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
  refetch: () => void;
}

const Folder: FC<Props> = ({
  folder: { id, name, path, __typename },
  openContextMenu,
  refetch,
}) => {
  const [, drag] = useDrag({
    item: { id, type: 'folder' },
  });

  return (
    <DropWrapper id={id} folderType={__typename} refetch={refetch}>
      <div onContextMenu={openContextMenu} style={{ cursor: 'context-menu' }}>
        <StyledLink to={path}>
          <FolderWrapper ref={drag}>
            <FolderSvg />
            <FolderName>{name}</FolderName>
          </FolderWrapper>
        </StyledLink>
      </div>
    </DropWrapper>
  );
};

export default Folder;
