import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteCountryGroup = ({ setDeleteModalOpen, schedule, deleteSchedule, refetch }) => (
  <Dialog open>
    <DialogTitle id="alert-dialog-title">Delete this schedule?</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to delete this schedule?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          setDeleteModalOpen(false);
        }}
        color="primary"
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          deleteSchedule({ variables: { id: schedule.id } }).then(() => {
            refetch();
          });
        }}
        color="primary"
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
export default DeleteCountryGroup;
