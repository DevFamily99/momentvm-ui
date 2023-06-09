import React, { useState, useRef, useEffect, FunctionComponent } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PopOverProps {
  label: JSX.Element | string;
  forceWidth?: number;
  forceHeight?: number;
  closeOnClick?: boolean;
}
interface WrapperProps {
  forceWidth?: number;
  forceHeight?: number;
}

interface HeadlineProps {
  title: JSX.Element | string;
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  .popover {
    position: absolute;
    z-index: 99999;
    background-color: white;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    left: 0;
    top: 0;
  }
  @media (prefers-color-scheme: dark) {
    .popover {
      background-color: #252525;
      color: white;
      border: 1px solid #6b6b6b;
    }
  }
`;

interface PopOverContainerProps {
  forceWidth?: number;
  forceHeight?: number;
}
/**
 * Wraps children and is reponsible for limiting height
 */
const PopOverContainer = styled.div`
  max-height: ${(props: PopOverContainerProps) => `${props.forceHeight}px` || 'none'};
  overflow: ${(props: PopOverContainerProps) =>
    props.forceHeight ? 'scroll' : 'visible'};
`;

export const Seperator = styled.div`
  border-bottom: 1px solid #f1f1f1;
`;

const MenuItemWrapper = styled.div`
  min-height: 30px;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
  color: ${(props: MenuItemProps) => (props.color ? props.color : 'inherit')};
`;

interface MenuItemProps {
  label: JSX.Element | string;
  onClick?: () => void;
  color?: string;
  target?: string;
  className?: string;
}

export const MenuItem: FunctionComponent<MenuItemProps> = ({
  label,
  children,
  onClick,
  color,
  target,
  className,
}) => {
  let pathFunction = () => {
    window.location.href = target || '#';
  };
  if (onClick) {
    pathFunction = onClick;
  }
  return (
    <MenuItemWrapper
      onClick={pathFunction}
      color={color}
      label={label}
      className={className}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
        {label}
      </motion.div>
      {children}
    </MenuItemWrapper>
  );
};

const HeadlineWrapper = styled.div`
  text-align: center;
  font-weight: bolder;
  padding: 10px 20px;
`;

export const Headline: FunctionComponent<HeadlineProps> = ({ children, title }) => (
  <HeadlineWrapper>
    {title}
    {children}
  </HeadlineWrapper>
);

const PopOver: FunctionComponent<PopOverProps> = ({
  label,
  children,
  forceWidth,
  forceHeight,
  closeOnClick,
}) => {
  const [isPopoverOpen, setOpenState] = useState(false);
  const node = useRef<HTMLInputElement>(null);
  const handleClick = (e: MouseEvent) => {
    if (node.current) {
      if (e.target == null) {
        return;
      }
      if (e.target instanceof Node) {
        if (node.current.contains(e.target)) {
          // inside click
          if (closeOnClick) {
            setOpenState(false);
          }
          return;
        }
      }
    }
    // outside click
    setOpenState(false);
  };
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return (
    <Wrapper ref={node}>
      <motion.a onClick={() => setOpenState(true)}>{label}</motion.a>
      <motion.div
        className="popover"
        initial={{
          opacity: 0,
          scale: 0.1,
        }}
        style={{
          width: forceWidth || 'inherit',
          maxHeight: forceHeight || 'inherit',
        }}
        animate={{
          opacity: isPopoverOpen ? 1 : 0,
          scale: isPopoverOpen ? 1 : 0.1,
        }}
      >
        <PopOverContainer forceHeight={forceHeight}>{children}</PopOverContainer>
      </motion.div>
    </Wrapper>
  );
};

export default PopOver;
