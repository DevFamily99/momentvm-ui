import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { Page } from '../components/folders/Page';

const GET_PAGES = gql`
  {
    createdAt: pages(maxResults: 15, order: "created_at") {
      id
      name
      thumb
      pageActivities {
        id
        note
        createdAt
        user {
          email
        }
      }
    }
    updatedAt: pages(maxResults: 15, order: "updated_at") {
      id
      name
      thumb
      pageActivities {
        id
        note
        createdAt
        user {
          email
        }
      }
    }
    pageViews {
      id
      page {
        id
        name
        thumb
        pageActivities {
          id
          note
          createdAt
          user {
            email
          }
        }
      }
    }
  }
`;

const PagesWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const App = () => {
  const [pageViews, setPageViews] = useState([]);
  const [newestPages, setNewestPages] = useState([]);
  const [recentPages, setRecentPages] = useState([]);
  const { loading, error, data } = useQuery(GET_PAGES);
  useQuery(GET_PAGES, {
    onCompleted: (data) => {
      setRecentPages(data.updatedAt);
      setNewestPages(data.createdAt);
      setPageViews(data.pageViews);
    },
  });

  if (loading) return 'Loading…';
  if (error) return `Error! ${error.message}`;
  return (
    <>
      <h1>Home</h1>
      <h2>Recently Viewed</h2>
      <PagesWrapper>
        {pageViews.map((pv) => (
          <Page alignLabel="left" page={pv.page} />
        ))}
      </PagesWrapper>
      <h2>Recently Updated</h2>
      <PagesWrapper>
        {recentPages.map((np) => (
          <Page alignLabel="left" page={np} />
        ))}
      </PagesWrapper>
      <h2>Newest</h2>
      <PagesWrapper>
        {newestPages.map((np) => (
          <Page alignLabel="left" page={np} />
        ))}
      </PagesWrapper>
    </>
  );
};
export default App;
