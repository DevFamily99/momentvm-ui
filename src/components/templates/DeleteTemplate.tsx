import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { ApolloQueryResult } from '@apollo/client';
import { navigate } from 'gatsby-link';
import { DELETE_TEMPLATE } from '../../utils/queries';

interface TemplateSchemaType {
  id: string;
  body: string;
}
interface Template {
  id: string;
  name: string;
  description: string;
  image_url: string;
  templateSchema: TemplateSchemaType;
  body: string;
  schemaBody: string;
}

interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  template: Template;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteTemplate = ({ setDeleteModalOpen, template, refetch }: Props) => {
  const [deleteTemplate] = useMutation(DELETE_TEMPLATE);
  return (
    <Dialog open>
      <DialogTitle id="alert-dialog-title">Delete template?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the template <b>{template.name}</b>?
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
            await deleteTemplate({ variables: { id: template.id } })
              .then(() => {
                setDeleteModalOpen(false);
                toast.success('Template was deleted sucessfully.');
                navigate('/templates/archive');
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
export default DeleteTemplate;
