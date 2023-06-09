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
import { ARCHIVE_TEMPLATE } from '../../utils/queries';

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
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ArchiveTemplate = ({ setArchiveModalOpen, template, refetch }: Props) => {
  const [archiveTemplate] = useMutation(ARCHIVE_TEMPLATE);
  return (
    <Dialog open>
      <DialogTitle id="alert-dialog-title">Archive template?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to archive the template <b>{template.name}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setArchiveModalOpen(false);
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            await archiveTemplate({ variables: { id: template.id } })
              .then(() => {
                setArchiveModalOpen(false);
                toast.success('Template was archived sucessfully.');
                refetch();
              })
              .catch((errors) => toast.error(String(errors)));
          }}
        >
          Archive
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ArchiveTemplate;
