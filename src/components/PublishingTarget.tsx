import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { DialogContentText } from '@material-ui/core';
import Button from './MVMButton';
import MVMDialog from './MVMDialog';

const DELETE_PUBLISHING_TARGET = gql`
  mutation DeletePublishingTarget($id: ID!) {
    deletePublishingTarget(input: { id: $id }) {
      publishingTarget {
        id
      }
    }
  }
`;

const PublishingTargetContainer = styled.div`
  display: flex;
  max-width: 400px;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
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

interface PublishingTarget {
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
  publishingTarget: PublishingTarget;
  setPublishingTarget: any;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const PublishingTarget = ({
  publishingTarget,
  setPublishingTarget,
  setNewModalOpen,
  refetch,
}: Props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePublishingTarget] = useMutation(DELETE_PUBLISHING_TARGET);

  const deleteDialogContent = () => {
    return (
      <DialogContentText id="alert-dialog-description">
        <span>
          Are you sure you want to delete publishing target <b>{publishingTarget.name}</b>
          ?{' '}
        </span>{' '}
        <br />
        <span>This can break schedules that use this publishing target.</span>
      </DialogContentText>
    );
  };

  return (
    <PublishingTargetContainer>
      <Title>{publishingTarget.name}</Title>

      <div>
        <Button
          label="Edit"
          className="hidden_button"
          onClick={() => {
            setPublishingTarget(publishingTarget);
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
          title="Delete Publishing target?"
          successToast="Publishing Target was deleted successfully"
          content={deleteDialogContent()}
          mutation={deletePublishingTarget}
          mutationVariables={{ id: publishingTarget.id }}
          refetch={refetch}
          submitButtonLabel="Delete"
        />
      )}
    </PublishingTargetContainer>
  );
};
export default PublishingTarget;
