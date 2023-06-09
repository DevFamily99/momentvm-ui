import React from 'react';
import styled from 'styled-components';

const FieldContainter = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldTemplate = ({ id, classNames, label, help, required, description, errors, children }) => {
  return (
    <FieldContainter>
      <label htmlFor={id}>
        {label}
        {required ? '*' : null}
      </label>
      {description}
      {children}
      {errors}
      {help}
    </FieldContainter>
  );
};

export default FieldTemplate;
