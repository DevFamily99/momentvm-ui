import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { DialogContentText } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from './MVMButton';
import MVMDialog from './MVMDialog';

const DELETE_PAGE_CONTEXT = gql`
  mutation DeletePageContext($id: ID!) {
    deletePageContext(input: { id: $id }) {
      pageContext {
        id
      }
    }
  }
`;

const PageContextContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  max-width: 400px;
  justify-content: space-between;
  &:hover .hidden_button {
    display: inline-flex !important;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: inline-flex;
  width: fit-content;
  height: 40px;
  margin-right: 20px;
  padding: 6px;
`;

interface PageContext {
  id: string;
  name: string;
  context: string;
  slot: string;
  renderingTemplate: string;
  previewWrapperUrl: string;
  selector: string;
}

interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  pageContext: PageContext;
  setPageContext: any;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const PageContext = ({
  pageContext,
  setPageContext,
  setNewModalOpen,
  refetch,
}: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePageContext] = useMutation(DELETE_PAGE_CONTEXT);

  const deleteDialogContent = () => {
    return (
      <DialogContentText id="alert-dialog-description">
        <span>
          Are you sure you want to delete page context <b>{pageContext.name}</b>?{' '}
        </span>{' '}
        <br />
        <span>This can break schedules that use this page context.</span>
      </DialogContentText>
    );
  };

  return (
    <PageContextContainer>
      <Title>{pageContext.name}</Title>

      <div>
        <Button
          label="Edit"
          className="hidden_button"
          onClick={() => {
            setPageContext(pageContext);
            setNewModalOpen(true);
          }}
        />
        <Button
          label="Delete"
          buttonState="delete"
          className="hidden_button"
          onClick={() => {
            setDeleteModalOpen(true);
          }}
        />
      </div>
      {deleteModalOpen && (
        <MVMDialog
          showDialog={setDeleteModalOpen}
          title="Delete page context?"
          successToast="Page context was deleted successfully"
          content={deleteDialogContent()}
          mutation={deletePageContext}
          mutationVariables={{ id: pageContext.id }}
          refetch={refetch}
          submitButtonLabel="Delete"
        />
      )}
    </PageContextContainer>
  );
};
export default PageContext;
