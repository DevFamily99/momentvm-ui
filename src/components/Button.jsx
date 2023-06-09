import React from 'react';

const buttonStyle = {
  backgroundColor: '0px 0px 0px 1px transparent inset, 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset',
  fontSize: '0.8rem',
  borderRadius: '50px',
  minHeight: '1em',
  padding: '0.78571429em 1.5em 0.78571429em',
  whiteSpace: 'nowrap',
  background: '#000000',
  color: '#ffffff',
  outline: 'none',
  maxHeight: '3em',
  margin: '0.2rem',
  width: 'max-content',
  border: 'none',
  cursor: 'pointer',
};

const Button = ({ onClick, text, type, disabled, children, style }) => (
  <button
    onClick={onClick}
    type={type || 'button'}
    disabled={disabled || false}
    className="ui buttons"
    variant="contained"
    style={{ ...buttonStyle, ...style }}
  >
    {children || text}
  </button>
);

export default Button;
