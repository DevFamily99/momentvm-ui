import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';
import { Page } from './Page';

const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(input: { id: $id }) {
      page {
        id
      }
    }
  }
`;

interface Props {
  page: Page;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeletePage = ({ setDeleteModalOpen, page }: Props) => {
  const [deletePage] = useMutation(DELETE_PAGE);
  return (
    <Dialog open>
      <DialogTitle id="alert-dialog-title">Delete page?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the page <b>{page.name}</b>?
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
            await deletePage({ variables: { id: page.id } })
              .then(() => {
                setDeleteModalOpen(false);
                toast.success('Page was deleted sucessfully.');
                window.location = '/';
              })
              .catch((errors) => toast.error(String(errors)));
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeletePage;
