import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.footer`
  text-align: center;
`;

interface Props {
  version: string;
}

const FooterText = styled.p`
  /* to offset the sidebar */
  margin-right: 20vw;
  color: #aeaeae;
`;

const Footer: FC<Props> = ({ version }) => {
  return (
    <Wrapper>
      <FooterText>MOMENTVM Content Cloud © 2023 v{version}</FooterText>
    </Wrapper>
  );
};

export default Footer;
