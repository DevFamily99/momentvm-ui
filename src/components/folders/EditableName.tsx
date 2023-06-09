/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import MVMEditableInput from '../MVMEditableInput';

export const UPDATE_FOLDER = gql`
  mutation UpdateFolder($folderId: ID!, $name: String!, $folderType: String!) {
    updateFolder(input: { folderId: $folderId, name: $name, folderType: $folderType }) {
      message
    }
  }
`;

interface Props {
  currentFolder: any;
  isArchive: boolean;
}

const EditableName: FC<Props> = ({ currentFolder, isArchive }) => {
  const [updateFolder] = useMutation(UPDATE_FOLDER, {
    onCompleted: (data) => toast.success(data.updateFolder.message),
  });
  if (isArchive) {
    return <span style={{ marginBottom: '3px' }}>Archive</span>;
  }
  return (
    <MVMEditableInput
      value={currentFolder.name}
      mutationVariables={{
        folderId: Number(currentFolder.id),
        folderType: currentFolder.__typename,
      }}
      size="small"
      mutation={updateFolder}
      mutationUpdateParam="name"
    />
  );
};
export default EditableName;
