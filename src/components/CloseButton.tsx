import React, { FC } from 'react';

const CloseButtonSVG = () => (
  <svg
    width="14px"
    height="14px"
    viewBox="0 0 14 14"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="close" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <polygon
        id="Line"
        fill="#979797"
        fillRule="nonzero"
        points="13.3414839 0 -0.0379585263 13.3794424 0.620557562 14.0379585 14 0.658516088"
      />
      <polygon
        id="Line"
        fill="#979797"
        fillRule="nonzero"
        transform="translate(6.981021, 7.018979) scale(-1, 1) translate(-6.981021, -7.018979) "
        points="13.3414839 0 -0.0379585263 13.3794424 0.620557562 14.0379585 14 0.658516088"
      />
    </g>
  </svg>
);

const buttonStyle = {
  order: 2,
  cursor: 'pointer',
};

interface CloseButtonProps {
  func: (event) => void;
  style?: object;
  id?: string;
}

const CloseButton: FC<CloseButtonProps> = ({ func, style, id }) => (
  <div
    role="button"
    id={id}
    tabIndex={0}
    style={{ ...buttonStyle, ...style }}
    onKeyPress={func}
    onClick={func}
  >
    <CloseButtonSVG />
  </div>
);

export default CloseButton;
