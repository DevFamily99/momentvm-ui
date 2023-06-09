import React, { FC, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import styled from 'styled-components';
import { sub } from 'date-fns';
import Comment from './Comment';
import NewComment from './NewComment';
import { PageComment } from '../../../types';

export const PAGE_COMMENTS = gql`
  subscription PageComments($pageId: ID!) {
    pageComments(pageId: $pageId) {
      id
      body
      createdAt
      user {
        id
        email
      }
    }
  }
`;

const CommentsWrapper = styled.div`
  flex: 2;
`;

const CommentsWindow = styled.div`
  max-height: 800px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
`;

const SubTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 3px solid #adadad;
  margin-right: 10%;
  padding-bottom: 1rem;
`;

const NoComments = styled.p`
  text-align: center;
  color: darkgrey;
`;

interface PageCommentProps {
  pageId: string;
}

const PageComments: FC<PageCommentProps> = ({ pageId }) => {
  const [comments, setComments] = useState<[PageComment] | []>([]);
  const { loading, error: subscriptionError } = useSubscription(PAGE_COMMENTS, {
    variables: { pageId },
    onSubscriptionData: (res) => {
      setComments(res.subscriptionData.data.pageComments);
    },
  });
  return (
    <CommentsWrapper>
      <SubTitle>Comments</SubTitle>
      <CommentsWindow>
        {loading && <NoComments>Loading...</NoComments>}
        {subscriptionError && <NoComments>Error loading comments</NoComments>}
        {comments.length > 0 &&
          comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
        {comments.length === 0 && (
          <NoComments>There are no comments yet, be the first to write one.</NoComments>
        )}
      </CommentsWindow>
      <NewComment pageId={pageId} />
    </CommentsWrapper>
  );
};

export default PageComments;
