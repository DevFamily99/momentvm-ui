import React, { useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import { DiffEditor } from '@monaco-editor/react';
import { navigate } from 'gatsby';
import Button from '../MVMButton';

import {
  VersionResponse,
  VersionChangesParams,
  TemplateQueryVariables,
  TemplateResponse,
} from './types';
import { REVERT_CHANGES } from './Versions';

export const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    template(id: $id) {
      id
      name
      body
    }
  }
`;

export const GET_VERSION = gql`
  query GetVersion($id: ID!) {
    version(id: $id) {
      id
      body
      itemType
      whodunnit
      createdAt
    }
  }
`;

const VersionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  height: 800px;
`;
const Actions = styled.div`
  position: fixed;
  right: 40px;
  bottom: 40px;
  display: flex;
  background: white;
  padding: 0.5rem 0.7rem;
  border-radius: 100px;
  align-items: center;
`;

const VersionChanges: FunctionComponent<VersionChangesParams> = (params) => {
  const [templateValues, setTemplateValues] = useState({
    id: '',
    name: 'Template',
    body: '',
  });
  const [versionValues, setVersionValues] = useState({
    body: '',
    whodunnit: '',
    createdAt: '',
  });

  const [revertChanges] = useMutation(REVERT_CHANGES, {
    refetchQueries: [{ query: GET_TEMPLATE, variables: { id: params.template } }],
  });

  useQuery<TemplateResponse, TemplateQueryVariables>(GET_TEMPLATE, {
    variables: { id: params.template },
    onCompleted: (data) => {
      if (data) {
        setTemplateValues({
          id: data.template.id,
          name: data.template.name,
          body: data.template.body,
        });
      }
    },
  });
  useQuery<VersionResponse, TemplateQueryVariables>(GET_VERSION, {
    variables: { id: params.version },
    onCompleted: (data) => {
      if (data) {
        setVersionValues({
          body: data.version.body,
          whodunnit: data.version.whodunnit,
          createdAt: data.version.createdAt,
        });
      }
    },
  });
  return (
    <>
      <h1>
        Changes made on {moment(versionValues.createdAt).format('DD/MM/YYYY [at] H:mm')}{' '}
        by {versionValues.whodunnit}
      </h1>
      <VersionWrapper>
        <DiffEditor
          theme="dark"
          language="html"
          original={templateValues.body}
          modified={versionValues.body}
        />
        <Actions>
          <Button
            label="Back"
            onClick={() => navigate(`/templates/${templateValues.id}/versions/`)}
          />
          <Button
            buttonState="highlight"
            label="Revert Changes"
            onClick={() => {
              revertChanges({
                variables: { id: params.template, versionId: params.version },
              }).then(() => navigate(`/templates/${templateValues.id}/`));
            }}
          />
        </Actions>
      </VersionWrapper>
    </>
  );
};

export default VersionChanges;
