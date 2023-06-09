import React from 'react';
import { TextField } from '@material-ui/core';

const MaterialInput = ({ value, required, onChange }) => {
  return (
    <TextField
      type="text"
      variant="outlined"
      value={value}
      required={required}
      onChange={event => onChange(event.target.value)}
    />
  );
};

export default MaterialInput;
