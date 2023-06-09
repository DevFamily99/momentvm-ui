import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

const MaterialInput = ({ value, options: { enumOptions }, onChange }) => {
  return (
    <Select type="text" variant="outlined" fullWidth value={value} onChange={event => onChange(event.target.value)}>
      {enumOptions.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MaterialInput;
