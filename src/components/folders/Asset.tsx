import React, { FC } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import Image from '../MVMImage';
import ImageResultName from '../ImageResultName';
import { Link } from 'gatsby';
import { AssetObj } from './types';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const AssetWrapper = styled.div`
  height: 200px;
  width: 200px;
`;

const ImageWrapper = styled.div`
  margin: 5%;
  img {
    height: 160px;
  }
`;

interface Props {
  asset: AssetObj;
  openContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Asset: FC<Props> = ({ asset: { id, name, thumbnail }, openContextMenu }) => {
  const [c, drag] = useDrag({ item: { id, type: 'asset' } });
  return (
    <div ref={drag} onContextMenu={openContextMenu} style={{ cursor: 'context-menu' }}>
      <StyledLink draggable to={`/media-files/${id}`}>
        <AssetWrapper>
          <ImageWrapper>
            <Image src={thumbnail} alt={name} />
          </ImageWrapper>
          <ImageResultName name={name} />
        </AssetWrapper>
      </StyledLink>
    </div>
  );
};

export default Asset;
