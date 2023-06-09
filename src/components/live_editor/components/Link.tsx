import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Icon from './Icon';

/**
 * A Link that can either use a static href or a function (e.g. from redux)
 *
 * @param {to} Static link
 * @param {func} A function to be called.
 *
 */

const Button = styled.div`
  border: none;
  font-weight: 700;
  font-size: 0.8rem;
  font-family: 'Nunito Sans';
  padding-left: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  height: 1rem;
  font-family: 'Nunito Sans';
  font-weight: bold;
  a {
    color: black;
    text-decoration: none;
  }
`;

interface Props {
  image: string;
  func?: () => {};
  to: string;
}

const Link: FunctionComponent<Props> = ({ image, func, children, to }) => (
  <LinkWrapper>
    {image ? <Icon image={image} /> : null}

    {func ? (
      <Button type="button" onClick={func}>
        {children}
      </Button>
    ) : (
      <a href={to}>
        <Button type="button">{children}</Button>
      </a>
    )}
  </LinkWrapper>
);

export default Link;
