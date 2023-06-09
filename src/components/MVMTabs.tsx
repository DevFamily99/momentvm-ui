import React, { FunctionComponent, useState, ReactElement } from 'react';
import styled from 'styled-components';
// import { motion } from 'framer-motion';

const ContentWrapper = styled.div`
  & > div {
    margin-bottom: 1rem;
  }
`;

const MVMTabContainer = styled.div`
  border-bottom: ${(props: MVMTabContainerProps) => (props.isActive ? '3px solid grey' : 'none')};
  .content-wrapper {
    display: ${(props: MVMTabContainerProps) => (props.isActive ? 'flex' : 'none')};
  }
`;

const MVMTabsContainer = styled.div`
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 1rem 1rem;
  margin-bottom: 1rem;
  & > p {
    flex: auto;
  }
  &:hover {
    cursor: pointer;
  }
  & > div {
    padding: 0 20px;
    position: relative;
  }
`;

export const Content: FunctionComponent<ContentProps> = ({ children, className }) => (
  <>
    <div className={className}>{children}</div>
  </>
);

interface ContentProps {
  onClick?: () => void;
  label: string | JSX.Element;
  children: ReactElement[] | ReactElement;
  className?: string;
}

interface MVMTabContainerProps {
  isActive: boolean;
}

interface TabsProps {
  onClick?: () => void;
  children: ReactElement<ContentProps>[];
}

const Tabs: FunctionComponent<TabsProps> = ({ children }) => {
  let initialIndex = 0;
  if (localStorage.getItem('momentvm-page-tab-index')) {
    initialIndex = Number(localStorage.getItem('momentvm-page-tab-index'));
  }
  const tabs = React.Children.map(children, child => child);
  if (initialIndex > tabs.length) {
    initialIndex = 0;
  }
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  let activeChildren = null;
  if (tabs[activeIndex] === undefined) {
    // index out of bounds
    activeChildren = tabs[0].props.children;
  } else {
    activeChildren = tabs[activeIndex].props.children;
  }

  return (
    <>
      <MVMTabsContainer className="tabs-container">
        {tabs.map((tab, index) => {
          return (
            <MVMTabContainer
              key={index.toString()}
              isActive={activeIndex === index}
              onClick={() => {
                setActiveIndex(index);
                localStorage.setItem('momentvm-page-tab-index', index.toString());
              }}
            >
              <h3>{tab.props.label}</h3>
            </MVMTabContainer>
          );
        })}
      </MVMTabsContainer>
      <ContentWrapper>{activeChildren}</ContentWrapper>
    </>
  );
};

export default Tabs;
