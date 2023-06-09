import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ControlledEditor } from '@monaco-editor/react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import Button from './MVMButton';

const UPDATE_SETTING = gql`
  mutation UpdateSetting($name: String!, $body: String!) {
    updateSetting(input: { name: $name, body: $body }) {
      setting {
        id
      }
    }
  }
`;

const GET_SETTING = gql`
  query GetSetting($name: String!) {
    setting(name: $name) {
      id
      name
      body
    }
  }
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

const YAMLSettingEditor = ({ setting }) => {
  const [body, setBody] = useState('');

  useQuery(GET_SETTING, {
    variables: { name: setting },
    onCompleted: (data) => setBody(data.setting.body),
  });

  const [updateSetting] = useMutation(UPDATE_SETTING, {
    onCompleted: () => toast.success('Setting updated.'),
  });

  return (
    <>
      <ControlledEditor
        value={body}
        onChange={(e, value) => {
          setBody(value);
        }}
        height="800px"
        language="yaml"
        theme="dark"
      />
      <Actions>
        <Button label="Back" onClick={() => navigate(`/settings/`)} />
        <Button
          buttonState="highlight"
          label="Save Changes"
          onClick={() => updateSetting({ variables: { name: setting, body } })}
        />
      </Actions>
    </>
  );
};

export default YAMLSettingEditor;
