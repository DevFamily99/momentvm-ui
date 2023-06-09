import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Button from '../../components/MVMButton';
import PageContext from '../../components/PageContext';
import PageContextForm from '../../components/PageContextForm';
import checkPermission from '../../utils/permission';

export const GET_PAGE_CONTEXTS = gql`
  {
    pageContexts {
      id
      name
      slot
      contextType
      renderingTemplate
      selector
      previewWrapperUrl
    }
  }
`;

const NoPageContexts = styled.div`
  margin: 1rem 0;
`;

const PageContextsPage = () => {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [pageContext, setPageContext] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_PAGE_CONTEXTS);
  if (loading) return <>Loading</>;
  if (error) return <>Error</>;
  if (!checkPermission('can_see_settings')) {
    navigate('/');
    return <></>;
  }

  return (
    <>
      <h1>Page Contexts</h1>
      <p>Page contexts serve as default settings for content slots.</p>

      <div className="pageContexts-list">
        {data.pageContexts.map((pageContext) => (
          <PageContext
            key={pageContext.id}
            refetch={refetch}
            pageContext={pageContext}
            setPageContext={setPageContext}
            setNewModalOpen={setNewModalOpen}
          />
        ))}
      </div>

      {data.pageContexts.length === 0 && (
        <NoPageContexts>
          <p>You have not yet created any page contexts.</p>
        </NoPageContexts>
      )}

      <div>
        <Button
          onClick={() => {
            setPageContext(null);
            setNewModalOpen(true);
          }}
          label="New Page Context"
          buttonState="highlight"
        />
        {newModalOpen && (
          <PageContextForm
            pageContext={pageContext}
            setNewModalOpen={setNewModalOpen}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
};

export default PageContextsPage;
