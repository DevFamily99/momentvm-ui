import React, { useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import { navigate } from 'gatsby';
import moment from 'moment';
import Button from '../MVMButton';
import { TemplateResponse, TemplateData, TemplateQueryVariables } from './types';
import { GET_TEMPLATE } from './VersionChanges';

export const GET_TEMPLATE_VERSIONS = gql`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      id
      name
      description
      imageUrl
      versionCount
      versions {
        id
        itemType
        whodunnit
        createdAt
      }
    }
  }
`;

export const REVERT_CHANGES = gql`
  mutation RevertTemplateVersion($id: ID!, $versionId: ID!) {
    revertTemplateVersion(input: { id: $id, versionId: $versionId }) {
      template {
        id
        name
      }
    }
  }
`;

const VersionWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  margin-top: 2rem;
`;

const SingleVersion = styled.div`
  display: grid;
  grid-auto-flow: column;
  /* grid-column-gap: 20px; */
  align-items: center;
  grid-auto-columns: 14vw;

  margin-top: 2rem;
`;

const Versions: FunctionComponent<TemplateData> = (templateData) => {
  const [templateValues, setTemplateValues] = useState({
    id: '',
    name: 'Template',
    description: '',
    versions: [],
    versionCount: 0,
  });

  const [revertChanges] = useMutation(REVERT_CHANGES, {
    refetchQueries: [{ query: GET_TEMPLATE, variables: { id: templateData.template } }],
  });

  useQuery<TemplateResponse, TemplateQueryVariables>(GET_TEMPLATE_VERSIONS, {
    variables: { id: templateData.template },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        setTemplateValues({
          id: data.template.id,
          name: data.template.name,
          description: data.template.description,
          versionCount: data.template.versionCount,
          versions: data.template.versions,
        });
      }
    },
  });
  return (
    <>
      <h1>Versions of {templateValues.name}</h1>
      <Button label="Back" onClick={() => navigate(`/templates/${templateValues.id}/`)} />
      <VersionWrapper>
        {templateValues.versions.length === 0 && (
          <p>No previous versions of this template were found.</p>
        )}
        {templateValues.versions.map((version) => (
          <SingleVersion>
            <p>{version.whodunnit}</p>
            <p>{moment(version.createdAt).format('DD/MM/YYYY [at] H:mm')}</p>
            <Button
              onClick={() =>
                navigate(`/templates/${templateValues.id}/versions/${version.id}`)
              }
              label="View details"
            />
            <Button
              buttonState="highlight"
              label="Revert Changes"
              onClick={() => {
                revertChanges({
                  variables: { id: templateData.template, versionId: version.id },
                }).then(() => navigate(`/templates/${templateData.template}/`));
              }}
            />
          </SingleVersion>
        ))}
        <SingleVersion>
          <p>
            <strong>Change made by</strong>
          </p>
          <p>
            <strong>Time</strong>
          </p>
          <p />
          <p />
        </SingleVersion>
      </VersionWrapper>
    </>
  );
};

export default Versions;
