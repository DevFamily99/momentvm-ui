import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

const Wrapper = styled.div`
  & > svg {
    width: 100%;
  }
`;
const Loader = () => (
  <Wrapper>
    <ContentLoader speed={2} width={400} height={600} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
      <rect x="306" y="48" rx="3" ry="3" width="313" height="8" />
      <rect x="307" y="115" rx="3" ry="3" width="105" height="19" />
      <rect x="1" y="49" rx="3" ry="3" width="268" height="78" />
      <rect x="306" y="65" rx="3" ry="3" width="313" height="8" />
      <rect x="302" y="84" rx="3" ry="3" width="319" height="8" />
      <rect x="1" y="161" rx="3" ry="3" width="620" height="78" />
      <rect x="310" y="275" rx="3" ry="3" width="313" height="8" />
      <rect x="310" y="342" rx="3" ry="3" width="105" height="19" />
      <rect x="9" y="276" rx="3" ry="3" width="263" height="78" />
      <rect x="310" y="292" rx="3" ry="3" width="313" height="8" />
      <rect x="313" y="311" rx="3" ry="3" width="313" height="8" />
      <rect x="5" y="389" rx="3" ry="3" width="192" height="78" />
      <rect x="8" y="499" rx="3" ry="3" width="313" height="8" />
      <rect x="371" y="493" rx="3" ry="3" width="255" height="78" />
      <rect x="8" y="516" rx="3" ry="3" width="313" height="8" />
      <rect x="10" y="535" rx="3" ry="3" width="313" height="8" />
      <rect x="218" y="388" rx="3" ry="3" width="192" height="78" />
      <rect x="429" y="388" rx="3" ry="3" width="192" height="78" />
    </ContentLoader>
  </Wrapper>
);

export default Loader;
