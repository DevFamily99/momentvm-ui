import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Button from '../../components/MVMButton';
import PublishingTarget from '../../components/PublishingTarget';
import PublishingTargetForm from '../../components/PublishingTargetForm';
import checkPermission from '../../utils/permission';

export const GET_PUBLISHING_TARGETS_CONTEXTS = gql`
  {
    publishingTargets {
      id
      name
      publishingUrl
      catalog
      defaultLibrary
      webdavUsername
      webdavPassword
      webdavPath
      previewUrl
    }
  }
`;

const NoPublishingTargets = styled.div`
  margin: 1rem 0;
`;

const PublishingTargets = () => {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [publishingTarget, setPublishingTarget] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_PUBLISHING_TARGETS_CONTEXTS);
  if (loading) return <>Loading</>;
  if (error) return <>Error</>;
  if (!checkPermission('can_see_settings')) {
    navigate('/');
    return <></>;
  }

  return (
    <>
      <h1>Publishing Targets</h1>
      <p>
        A Publishing Target determines where MOMENTVM will send content to. Later you can
        freely choose your target for publishing. This could be a sandbox, development or
        staging.
      </p>
      <p>
        If you have any questions about the process or you need help with the setup,
        please contact us: <a href="mailto:cms@momentvm.com"> cms@momentvm.com </a>
      </p>

      <div className="publishingTargets-list">
        {data.publishingTargets.map((publishingTarget) => (
          <PublishingTarget
            key={publishingTarget.id}
            refetch={refetch}
            publishingTarget={publishingTarget}
            setPublishingTarget={setPublishingTarget}
            setNewModalOpen={setNewModalOpen}
          />
        ))}
      </div>

      {data.publishingTargets.length === 0 && (
        <NoPublishingTargets>
          <p>You don&apos;t have yet created any publishing targets.</p>
        </NoPublishingTargets>
      )}

      <div>
        <Button
          onClick={() => {
            setPublishingTarget(null);
            setNewModalOpen(true);
          }}
          label="New Publishing Target"
          buttonState="highlight"
        />
        {newModalOpen && (
          <PublishingTargetForm
            publishingTarget={publishingTarget}
            setNewModalOpen={setNewModalOpen}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
};

export default PublishingTargets;
