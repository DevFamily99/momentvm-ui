import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface MenuItemBarProps {
  justifyContent?: 'space-between' | 'flex-start';
}

interface WrapperProps {
  justifyContent?: 'space-between' | 'flex-start';
}

const Wrapper = styled.div`
  display: flex;
  justify-content: ${(props: WrapperProps) => props.justifyContent || 'flex-start'};
`;

const MenuItemBar: FunctionComponent<MenuItemBarProps> = ({ children, justifyContent }) => {
  return <Wrapper justifyContent={justifyContent}>{children}</Wrapper>;
};

export default MenuItemBar;
