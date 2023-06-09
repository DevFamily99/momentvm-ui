import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Button from '../../../Button';
import ImageSearch from '../ImageSearch';

const MaterialInput = ({ value, required, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <TextField
        type="text"
        variant="outlined"
        value={value}
        required={required}
        onChange={event => onChange(event.target.value)}
      />
      <Button text="Search Images" onClick={() => setDialogOpen(true)} />
      {dialogOpen && <ImageSearch setDialogOpen={setDialogOpen} onChange={onChange} />}
    </>
  );
};

export default MaterialInput;
