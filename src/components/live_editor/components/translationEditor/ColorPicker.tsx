import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { CREATE_TRANSLATION_EDITOR_COLOR } from '../../../../utils/queries';
import Button from '../../../Button';

const ColorPicker = ({ setColorPickerOpen, refetchColors }) => {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('');

  const [createColor] = useMutation(CREATE_TRANSLATION_EDITOR_COLOR);

  const handleSubmit = async () => {
    if (!name) toast.error('Name is required');
    const { data } = await createColor({ variables: { name, hex } });
    if (data) {
      refetchColors();
      toast.success('Color Saved');
      setColorPickerOpen(false);
    }
  };

  return (
    <Dialog open onClose={() => setColorPickerOpen(false)}>
      <DialogTitle>Create a custom color</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SketchPicker
          disableAlpha
          color={hex}
          onChangeComplete={(color) => setHex(color.hex)}
        />
      </DialogContent>
      <DialogActions>
        <Button text="Close" onClick={() => setColorPickerOpen(false)} />
        <Button text="Save" onClick={() => handleSubmit()} />
      </DialogActions>
    </Dialog>
  );
};

export default ColorPicker;
