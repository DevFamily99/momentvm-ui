import React, { FC } from 'react';
import styled from 'styled-components';
import { formatRelative } from 'date-fns';
import getCurrentUser from '../../../utils/current_user';
import { PageComment } from '../../../types';

interface CheckOwnerProps {
  currentUser: boolean;
}

const CommentRow = styled.div`
  display: flex;
  flex-direction: ${(props: CheckOwnerProps) =>
    props.currentUser ? 'row-reverse' : 'row'};
`;

const CommentWrapper = styled.div`
  background-color: ${(props: CheckOwnerProps) =>
    props.currentUser ? '#f0f0f0' : '#d5d5d5'};
  width: fit-content;
  margin-bottom: 1%;
  padding: 10px;
  border-radius: 12px;
`;

const User = styled.div`
  font-weight: bold;
`;

const Content = styled.div`
  margin-left: 10px;
`;

const TimeStamp = styled.div`
  font-size: 0.8rem;
  margin-left: 20px;
  font-style: italic;
  text-align: right;
`;

const formatTimestamp = (time) => {
  return formatRelative(new Date(time), new Date());
};
interface CommentProps {
  comment: PageComment;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  const currentUser = getCurrentUser().id === comment.user.id;
  return (
    <CommentRow currentUser={currentUser}>
      <CommentWrapper currentUser={currentUser}>
        <User>{comment.user.email}</User>
        <Content>{comment.body}</Content>
        <TimeStamp>{formatTimestamp(comment.createdAt)}</TimeStamp>
      </CommentWrapper>
    </CommentRow>
  );
};

export default Comment;
