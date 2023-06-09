import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { toast } from 'react-toastify';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import Cookies from 'js-cookie';
import Button from './MVMButton';

const ClearAllCountries = ({ setConfirmClearAllDialog }) => {
  const handleSubmit = () => {
    axios
      .post(
        `${process.env.GATSBY_API_URL}/api/teams/clear_sites`,
        {},
        {
          headers: {
            apiToken: localStorage.getItem('apiToken'),
          },
        },
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setConfirmClearAllDialog(false);
  };

  return (
    <Dialog
      open
      onClose={() => setConfirmClearAllDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Clear all the team Sites?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will clear all of the saved Countries. Only use this if you plan on doing a
          fresh import.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button label="Cancel" onClick={() => setConfirmClearAllDialog(false)} />
        <Button label="Confirm" buttonState="delete" onClick={() => handleSubmit()} />
      </DialogActions>
    </Dialog>
  );
};
export default ClearAllCountries;
