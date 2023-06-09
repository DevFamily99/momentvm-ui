import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import StyledTooltip from './styled/StyledTooltip';
import StyledTextField from './styled/StyledTextField';
import MVMDialog from './MVMDialog';

const CREATE_PUBLISHING_TARGET = gql`
  mutation CreatePublishingTarget(
    $name: String!
    $publishingUrl: String!
    $catalog: String
    $defaultLibrary: String
    $webdavUsername: String
    $webdavPassword: String
    $webdavPath: String
    $previewUrl: String
  ) {
    createPublishingTarget(
      input: {
        name: $name
        catalog: $catalog
        defaultLibrary: $defaultLibrary
        publishingUrl: $publishingUrl
        webdavUsername: $webdavUsername
        webdavPassword: $webdavPassword
        webdavPath: $webdavPath
        previewUrl: $previewUrl
      }
    ) {
      publishingTarget {
        id
        name
      }
    }
  }
`;

const UPDATE_PUBLISHING_TARGET = gql`
  mutation UpdatePublishingTarget(
    $id: ID!
    $name: String!
    $catalog: String
    $publishingUrl: String
    $defaultLibrary: String
    $webdavUsername: String
    $webdavPassword: String
    $webdavPath: String
    $previewUrl: String
  ) {
    updatePublishingTarget(
      input: {
        id: $id
        name: $name
        catalog: $catalog
        defaultLibrary: $defaultLibrary
        publishingUrl: $publishingUrl
        webdavUsername: $webdavUsername
        webdavPassword: $webdavPassword
        webdavPath: $webdavPath
        previewUrl: $previewUrl
      }
    ) {
      publishingTarget {
        id
        name
      }
    }
  }
`;

interface PublishingTarget {
  name: string;
  id: string;
  catalog: string;
  publishingUrl: string;
  defaultLibrary: string;
  webdavUsername: string;
  webdavPassword: string;
  webdavPath: string;
  previewUrl: string;
}

const PublishingTargetWrapper = styled.div`
  height: 33rem;
`;

interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  publishingTarget?: PublishingTarget;
}

const PublishingTargetForm = ({ publishingTarget, setNewModalOpen, refetch }: Props) => {
  const [values, setValues] = useState({
    id: null,
    name: '',
    publishingUrl: '',
    catalog: '',
    defaultLibrary: '',
    webdavUsername: '',
    webdavPassword: '',
    webdavPath: '',
    previewUrl: '',
  });
  const [errors, setErrors] = useState([]);
  const [savePublishingTarget] = publishingTarget
    ? useMutation(UPDATE_PUBLISHING_TARGET)
    : useMutation(CREATE_PUBLISHING_TARGET);
  const [title, setTitle] = useState('New Publishing Target');

  const handleChange = ({ target: { name, value } }) => {
    setErrors([]);
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };

  useEffect(() => {
    if (publishingTarget) {
      setTitle('Edit Publishing target');
      if (Object.keys(publishingTarget).length > 0) {
        setValues({
          id: publishingTarget.id,
          name: publishingTarget.name,
          publishingUrl: publishingTarget.publishingUrl,
          catalog: publishingTarget.catalog,
          defaultLibrary: publishingTarget.defaultLibrary,
          webdavUsername: publishingTarget.webdavUsername,
          webdavPassword: publishingTarget.webdavPassword,
          webdavPath: publishingTarget.webdavPath,
          previewUrl: publishingTarget.previewUrl,
        });
      }
    }
  }, []);

  const dialogContent = (values, errors, handleChange) => {
    return (
      <>
        <PublishingTargetWrapper>
          <StyledTooltip
            title="name already taken"
            open={!!errors.find((e) => e.field === 'name')}
          >
            <StyledTextField
              value={values.name}
              onChange={handleChange}
              required
              name="name"
              label="Name"
              helperText="A name indicating the role to your team"
              placeholder="Global header"
            />
          </StyledTooltip>

          <StyledTextField
            value={values.publishingUrl}
            onChange={handleChange}
            name="publishingUrl"
            label="Publishing Url"
            required
            // helperText="The slot ID in SFCC"
            placeholder="https://example.demandware.net"
          />

          <StyledTextField
            value={values.catalog}
            onChange={handleChange}
            name="catalog"
            label="Catalog"
            // helperText="The slot ID in SFCC"
            placeholder="your-catalog"
          />

          <StyledTextField
            value={values.defaultLibrary}
            onChange={handleChange}
            name="defaultLibrary"
            label="Default library"
            // helperText="The slot ID in SFCC"
            placeholder="DefaultLibrary"
          />

          <StyledTextField
            value={values.webdavUsername}
            onChange={handleChange}
            name="webdavUsername"
            label="Webdav username"
            // helperText="The slot ID in SFCC"
            placeholder=""
          />

          <StyledTextField
            value={values.webdavPassword}
            onChange={handleChange}
            name="webdavPassword"
            label="Webdav password"
            // helperText="The slot ID in SFCC"
            placeholder=""
          />

          <StyledTextField
            value={values.webdavPath}
            onChange={handleChange}
            name="webdavPath"
            label="Webdav path"
            // helperText="The slot ID in SFCC"
            placeholder=""
          />

          <StyledTextField
            value={values.previewUrl}
            onChange={handleChange}
            name="previewUrl"
            label="Preview Url"
            // helperText="The slot ID in SFCC"
            placeholder="https://example.com"
          />
        </PublishingTargetWrapper>
      </>
    );
  };

  return (
    <MVMDialog
      showDialog={setNewModalOpen}
      title={title}
      content={dialogContent(values, errors, handleChange)}
      mutation={savePublishingTarget}
      mutationVariables={{ ...values }}
      refetch={refetch}
      errors={errors}
      setErrors={setErrors}
      submitButtonState={values.name ? 'highlight' : 'disabled'}
    />
  );
};

export default PublishingTargetForm;
