import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import MVMButton from '../MVMButton';

export const CREATE_FOLDER = gql`
  mutation CreateFolder($folderId: ID!, $name: String!, $folderType: String!) {
    createFolder(input: { folderId: $folderId, name: $name, folderType: $folderType }) {
      message
    }
  }
`;

const NewFolder = ({ currentFolder, refetch, folderType }) => {
  const [name, setName] = useState('');
  const [createFolder] = useMutation(CREATE_FOLDER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createFolder({ variables: { folderId: currentFolder.id, name, folderType } });
    toast.success('Folder Created');
    setName('');
    refetch();
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <TextField
        placeholder="New Folder Name"
        required
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <MVMButton
        submit
        type="submit"
        label={`Create new folder in ${currentFolder.name}`}
        buttonState="highlight"
      />
    </form>
  );
};

export default NewFolder;
