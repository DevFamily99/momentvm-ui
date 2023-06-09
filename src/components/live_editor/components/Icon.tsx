/**
 * The MOMENTVM logo
 * Wrapper around the svg path
 */
import React, { FunctionComponent } from 'react';

interface Props {
  image: string;
}

const Icon: FunctionComponent<Props> = ({ image, children }) => (
  <div className="icon">
    <img src={image} alt={image} />
    {children}
  </div>
);

export default Icon;
