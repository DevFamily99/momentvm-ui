import React, { useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { HotKeys } from 'react-hotkeys';
import { ControlledEditor, EditorProps } from '@monaco-editor/react';
import axios from 'axios';
import { navigate } from 'gatsby';
import Switch from '../MVMSwitch';
import { GET_TEMPLATE, CREATE_TEMPLATE, UPDATE_TEMPLATE } from '../../utils/queries';
import EditableInput from '../MVMEditableInput';
import TagSelect from '../TagSelect';
import Button from '../MVMButton';
import ImageUpload from '../ImageUpload';
import {
  CreateTemplateResult,
  CreateTemplateVariables,
  TemplateResponse,
  TemplateData,
  TemplateQueryVariables,
} from './types';
import { GET_TEMPLATE_VERSIONS } from './Versions';
import ArchiveTemplate from './ArchiveTemplate';
import DeleteTemplate from './DeleteTemplate';

const options: EditorProps['options'] = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: true,
  // theme: 'vs-dark',
  minimap: {
    enabled: false,
  },
  useTabStops: false,
  formatOnPaste: true,
  formatOnType: true,
};

const keyMap = {
  SAVE: 'command+s',
  DELETE_NODE: ['del', 'backspace'],
};

const TemplateContainer = styled.div`
  display: flex;
  padding-right: 1rem;
  & > * {
    outline: none;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Wrapper = styled.div`
  width: 100%;
`;
const TextContainer = styled.div`
  flex: 0 0 500px;
`;
const ImageContainer = styled.div`
  flex: 0 0 400px;
`;

const Editors = styled.div`
  display: flex;
  margin: 2rem 0;
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

const Description = styled.div`
  margin-top: 5rem;
`;

const Template: FunctionComponent<TemplateData> = (templateData) => {
  const [createTemplate] = useMutation<CreateTemplateResult, CreateTemplateVariables>(
    CREATE_TEMPLATE,
  );
  const [updateTemplate] = useMutation(UPDATE_TEMPLATE, {
    refetchQueries: [
      { query: GET_TEMPLATE_VERSIONS, variables: { id: templateData.template } },
    ],
  });
  const [templateValues, setTemplateValues] = useState({
    id: '',
    name: '',
    description: '',
    versionCount: 0,
  });
  const [tagIds, setTagIds] = useState([]);
  const [fullScreen, toggleFullScreen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templateToArchive, setTemplateToArchive] = useState(null);
  const [templateBody, setTemplateBody] = useState('');
  const [secondaryTemplateBody, setSecondaryTemplateBody] = useState('');
  const [uiSchema, setUiSchema] = useState('');
  const [schema, setSchema] = useState('');
  const [showAssistantEditors, setShowAssistantEditors] = useState(true);
  const isNewTemplate = templateData.template === 'new';
  const { refetch, data, loading, error } = useQuery<
    TemplateResponse,
    TemplateQueryVariables
  >(GET_TEMPLATE, {
    variables: { id: templateData.template },
    skip: isNewTemplate,
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data) {
        setTemplateBody(data.template.body);
        setSecondaryTemplateBody(data.template.secondaryBody);
        setSchema(data.template.templateSchema.body);
        setUiSchema(data.template.uiSchemaYaml);
        setTagIds(data.template.tagIds);
        setTemplateValues({
          id: data.template.id,
          name: data.template.name,
          description: data.template.description,
          versionCount: data.template.versionCount,
        });
      }
    },
  });
  const uploadTemplateImage = (images) => {
    if (!images) {
      return;
    }
    const bodyFormData = new FormData();
    bodyFormData.append('image', images[0]);
    axios.defaults.headers.post.Accept = 'application/json';
    axios
      .post(
        `${process.env.GATSBY_API_URL}/api/templates/${
          data.template.id || 'new'
        }/image/upload`,
        bodyFormData,
        {
          headers: {
            apiToken: localStorage.getItem('apiToken'),
          },
        },
      )
      .then(() => {
        toast.success('Template was updated sucessfully.');
      })
      .catch((errors) => toast.error(String(errors)));
  };

  if (loading) {
    return <>Loading</>;
  }
  if (error) {
    return <>Error {error.message}</>;
  }
  return (
    <HotKeys keyMap={keyMap} style={{ outline: 'none' }}>
      <TemplateContainer>
        <Wrapper>
          <FormContainer>
            <TextContainer>
              <EditableInput
                value={templateValues.name}
                onChange={(value) => {
                  setTemplateValues({ ...templateValues, name: value || '' });
                }}
                size="large"
                placeholder="Template name"
              />

              <Description>
                <EditableInput
                  value={templateValues.description || ''}
                  onChange={(value) => {
                    setTemplateValues({ ...templateValues, description: value });
                  }}
                  size="small"
                  placeholder="Template description"
                />
              </Description>
              <TagSelect tagIds={tagIds} setTagIds={setTagIds} />
            </TextContainer>
            <ImageContainer>
              {!isNewTemplate && (
                <ImageUpload
                  existingImageURL={data.template.imageUrl}
                  uploadHandler={(images) => uploadTemplateImage(images)}
                />
              )}
            </ImageContainer>
          </FormContainer>
          <Editors>
            <ControlledEditor
              height="900px"
              width={showAssistantEditors ? '60%' : '100%'}
              language="html"
              value={templateBody}
              options={options}
              theme="dark"
              onChange={(e, value) => {
                setTemplateBody(value);
              }}
            />

            <ControlledEditor
              height="900px"
              width={showAssistantEditors ? '20%' : 0}
              language="yaml"
              value={schema}
              options={options}
              theme="dark"
              onChange={(e, value) => {
                setSchema(value);
              }}
            />

            <ControlledEditor
              height="900px"
              width={showAssistantEditors ? '20%' : 0}
              language="yaml"
              value={uiSchema}
              options={options}
              theme="dark"
              onChange={(e, value) => {
                setUiSchema(value);
              }}
            />
          </Editors>
          <h3>Secondary Template</h3>
          <p>If this is filled, it will be published instead of the template body</p>
          <ControlledEditor
            height="900px"
            width="100%"
            language="html"
            value={secondaryTemplateBody}
            options={options}
            theme="dark"
            onChange={(e, value) => {
              setSecondaryTemplateBody(value);
            }}
          />

          <Actions>
            {data &&
              data.template &&
              (!data.template.archived ? (
                <Button
                  onClick={() => {
                    setArchiveModalOpen(true);
                    setTemplateToArchive(data.template);
                  }}
                  label="Move to archive"
                />
              ) : (
                <Button
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setTemplateToDelete(data.template);
                  }}
                  label="Delete"
                  buttonState="delete"
                />
              ))}

            {archiveModalOpen && (
              <ArchiveTemplate
                setArchiveModalOpen={setArchiveModalOpen}
                template={templateToArchive}
                refetch={() => {
                  navigate('/templates');
                }}
              />
            )}
            {deleteModalOpen && (
              <DeleteTemplate
                setDeleteModalOpen={setDeleteModalOpen}
                template={templateToDelete}
                refetch={() => {
                  navigate('templates/archive');
                }}
              />
            )}

            <Button
              onClick={() => navigate(`/templates/${templateValues.id}/versions`)}
              label="View Previous Versions"
            />
            <Switch
              label="Show Template Schema"
              isOn={showAssistantEditors}
              handleToggle={() => {
                setShowAssistantEditors(!showAssistantEditors);
              }}
            />
            <Switch
              label="Fullscreen"
              isOn={fullScreen}
              handleToggle={() => {
                document.getElementById('sidebar').classList.toggle('sidebar-hidden');
                document
                  .getElementById('maincontent')
                  .classList.toggle('layout-fullwidth');
                toggleFullScreen(!fullScreen);
                document.querySelectorAll('section > div').forEach((element) => {
                  // resize parent element of editor to trigger a resize
                  element.style.width = '99%';
                  element.style.width = '100%';
                });
              }}
            />
            <Button label="Back" onClick={() => navigate('/templates/')} />
            <Button
              label="Save"
              onClick={async () => {
                if (isNewTemplate) {
                  await createTemplate({
                    variables: {
                      name: templateValues.name,
                      description: templateValues.description,
                      body: templateBody,
                      secondaryBody: secondaryTemplateBody,
                      schemaBody: schema,
                      uiSchema,
                      tagIds,
                    },
                  }).then((templateCreateResponse) => {
                    toast.success('Template was created sucessfully.');
                    navigate(
                      `/templates/${templateCreateResponse.data.createTemplate.template.id}`,
                    );
                  });
                } else {
                  await updateTemplate({
                    variables: {
                      id: templateData.template,
                      name: templateValues.name,
                      description: templateValues.description,
                      body: templateBody,
                      secondaryBody: secondaryTemplateBody,
                      schemaBody: schema,
                      uiSchema,
                      tagIds,
                    },
                  }).then(() => {
                    refetch();
                    toast.success('Template was updated sucessfully.');
                  });
                }
              }}
              buttonState="highlight"
            />
          </Actions>
        </Wrapper>
      </TemplateContainer>
    </HotKeys>
  );
};
export default Template;
