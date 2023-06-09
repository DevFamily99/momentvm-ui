import React from 'react';
import { useDrop } from 'react-dnd';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${(props) => (props.hover ? 'lightblue' : 'none')};
`;

const UPDATE_PARENT_FOLDER = gql`
  mutation UpdateParentFolder(
    $targetId: ID!
    $destinationId: ID!
    $dropType: String!
    $folderType: String!
  ) {
    updateParentFolder(
      input: {
        targetId: $targetId
        destinationId: $destinationId
        dropType: $dropType
        folderType: $folderType
      }
    ) {
      message
    }
  }
`;

const DropWrapper = ({ id, folderType, refetch, children }) => {
  const [updateParentFolder] = useMutation(UPDATE_PARENT_FOLDER, {
    onCompleted: (data) => toast.success(data.updateParentFolder.message),
  });
  const handleDrop = async (item) => {
    if (item.id === id && item.type === 'folder') {
      // dont drop a folder into itself
      return;
    }
    await updateParentFolder({
      variables: {
        targetId: item.id,
        destinationId: id,
        dropType: item.type,
        folderType,
      },
    });
    refetch();
  };

  const [collectedProps, drop] = useDrop({
    accept: ['folder', 'asset', 'page'],
    drop: (item) => handleDrop(item),
    collect: (monitor) => {
      return {
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver(),
      };
    },
  });
  return (
    <Wrapper hover={collectedProps.hovered} ref={drop}>
      {children}
    </Wrapper>
  );
};

export default DropWrapper;
