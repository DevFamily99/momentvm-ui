import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import CloseButton from '../../preview/components/CloseButton';
import Button from './MVMButton';

const DialogTitleWrapper = styled.div`
  h2 {
    display: flex;
    justify-content: space-between;
  }
`;

const DeleteCountryGroup = ({ setDeleteModalOpen, schedule, deleteSchedule, refetch }) => (
  <Dialog open onClose={() => setDeleteModalOpen(false)}>
    <DialogTitleWrapper>
      <DialogTitle id="alert-dialog-title">
        Delete this schedule?
        <CloseButton
          func={() => {
            setDeleteModalOpen(false);
          }}
        />
      </DialogTitle>
    </DialogTitleWrapper>

    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Are you sure you want to delete this schedule?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          deleteSchedule({ variables: { id: schedule.id } }).then(() => {
            refetch();
          });
        }}
        label="Delete"
        buttonState="delete"
      />
    </DialogActions>
  </Dialog>
);
export default DeleteCountryGroup;
