import React, { FC, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';

export const CREATE_PAGE_COMMENT = gql`
  mutation CreatePageComment($pageId: ID!, $body: String!) {
    createPageComment(input: { pageId: $pageId, body: $body }) {
      pageComment {
        id
      }
    }
  }
`;

const NoStyleButton = styled.button`
  border: 0;
  background: 0;
  outline: none;
  cursor: pointer;
`;

interface NewCommentProps {
  pageId: string;
}

const NewComment: FC<NewCommentProps> = ({ pageId }) => {
  const [newComment, setNewComment] = useState('');
  const [createPageComment] = useMutation(CREATE_PAGE_COMMENT);
  const handleSubmit = (e) => {
    e.preventDefault();
    createPageComment({ variables: { body: newComment, pageId } });
    setNewComment('');
  };
  return (
    <form data-page-id={pageId} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <NoStyleButton>
              <SendIcon />
            </NoStyleButton>
          ),
        }}
      />
    </form>
  );
};

export default NewComment;
