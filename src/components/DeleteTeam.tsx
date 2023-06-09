import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';

const DeleteTeam = ({ setDeleteModalOpen, teamId, deleteTeam }) => (
  <Dialog onClose={() => setDeleteModalOpen(false)} open>
    <DialogTitle id="alert-dialog-title">Delete this team?</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to delete this team?
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
        onClick={async () => {
          const res = await deleteTeam({ variables: { id: teamId } });
          if (res.data) {
            toast.success('Team was successfully deleted.');
          }
          if (res.erorrs) {
            toast.error('Error deleting team.');
          }
          setDeleteModalOpen(false);
        }}
        color="primary"
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
export default DeleteTeam;
