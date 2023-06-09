import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../../Button';
import CloseButton from '../../../CloseButton';
import { Template } from '../Module';
import buildModuleInitialData from '../../utils/moduleInitialData';
import { DELETE_PAGE_MODULE, GET_PAGE_MODULE } from '../../../../utils/queries';
import ModuleForm from '../ModuleForm';

export const GET_TEMPLATES = gql`
  query TemplateSearch($ids: [ID!]) {
    templates(ids: $ids) {
      id
      name
      imageUrl
      templateSchema {
        jsonBody
      }
    }
  }
`;

export const CREATE_NESTED_PAGE_MODULE = gql`
  mutation CreateNestedPageModule(
    $pageModuleId: ID!
    $fieldId: String!
    $templateId: ID!
    $pageModuleBody: JSON!
  ) {
    createNestedPageModule(
      input: {
        pageModuleId: $pageModuleId
        fieldId: $fieldId
        templateId: $templateId
        pageModuleBody: $pageModuleBody
      }
    ) {
      pageModule {
        id
      }
    }
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  svg {
    padding: 15px;
  }
`;

const TemplatesWrapper = styled.div``;

const TemplatePicker = ({ fieldId, pageModuleId, onChange, templateIds }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [createNestedPageModule] = useMutation(CREATE_NESTED_PAGE_MODULE);
  useQuery(GET_TEMPLATES, {
    variables: { ids: templateIds },
    onCompleted: (data) => {
      setTemplates(data.templates);
    },
  });

  const pickTemplate = (templateId) => {
    // create page module
    const schemaBody = JSON.parse(
      templates.find((template) => template.id === templateId).templateSchema.jsonBody,
    );
    const pageModuleBody = buildModuleInitialData(schemaBody);
    createNestedPageModule({
      variables: {
        fieldId: fieldId.slice(5), // Temp fix, will only work if the form field is not nested
        pageModuleId,
        templateId,
        pageModuleBody,
      },
    }).then((res) => {
      onChange(`nested::${res.data.createNestedPageModule.pageModule.id}::`);
      // setPageModuleId(res.data.createNestedPageModule.pageModule.id);
    });
    // open page module form for nested module
  };

  return (
    <>
      <ControlsWrapper>
        <Button text="Select Template" onClick={() => setDialogOpen(true)} />
        {dialogOpen && (
          <CloseButton style={{ width: '30px' }} func={() => setDialogOpen(false)} />
        )}
      </ControlsWrapper>
      {dialogOpen && (
        <TemplatesWrapper>
          {templates.map((template) => (
            <Template
              onClick={() => pickTemplate(template.id)}
              key={template.id}
              name={template.name}
              imageUrl={template.imageUrl}
              draggable={false}
            />
          ))}
        </TemplatesWrapper>
      )}
    </>
  );
};

const NestedTemplateEditor = ({ pageModuleId, onChange, reloadPreview }) => {
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_PAGE_MODULE, {
    variables: { pageModuleId },
  });
  if (error) {
    onChange('');
  }
  const [deletePageModule] = useMutation(DELETE_PAGE_MODULE);
  if (loading || error) {
    return <>loading...</>;
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the nested module?')) {
      const { data } = await deletePageModule({ variables: { id: pageModuleId } });
      if (data) {
        toast.success('Module has been deleted.');
        onChange('');
        // reloadPreview();
      }
    }
  };

  const {
    pageModule: { template },
  } = data;
  return (
    <>
      <Template name={template.name} imageUrl={template.imageUrl} draggable={false} />
      <ControlsWrapper>
        <Button text="Edit Nested" onClick={() => setModuleFormOpen(true)} />
        <Button text="Remove Nested" onClick={() => handleDelete()} />
      </ControlsWrapper>
      <div>
        {moduleFormOpen && (
          <ModuleForm
            pageModuleId={pageModuleId}
            reloadPreview={reloadPreview}
            setNewModuleOpen={() => {}}
            setReorderListOpen={() => {}}
          />
        )}
      </div>
    </>
  );
};

const NestedTemplateField = ({
  value,
  formContext: { pageModuleId, reloadPreview },
  options,
  onChange,
  id,
}) => {
  let nestedModuleId = value.match(/nested::(.*)::/);
  if (nestedModuleId) {
    nestedModuleId = nestedModuleId[1];
  }
  if (value === '') {
    return (
      <TemplatePicker
        fieldId={id}
        pageModuleId={pageModuleId}
        onChange={onChange}
        templateIds={options.enumOptions.map((o) => o.value)}
      />
    );
  }
  return (
    <NestedTemplateEditor
      pageModuleId={nestedModuleId}
      onChange={onChange}
      reloadPreview={reloadPreview}
    />
  );
};

export default NestedTemplateField;
