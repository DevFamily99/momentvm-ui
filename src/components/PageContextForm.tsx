import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import StyledTooltip from './styled/StyledTooltip';
import StyledTextField from './styled/StyledTextField';
import MVMDialog from './MVMDialog';

const CREATE_PAGE_CONTEXT = gql`
  mutation CreatePageContext(
    $name: String!
    $contextType: String!
    $slot: String!
    $renderingTemplate: String
    $selector: String
    $previewWrapperUrl: String
  ) {
    createPageContext(
      input: {
        name: $name
        contextType: $contextType
        slot: $slot
        renderingTemplate: $renderingTemplate
        selector: $selector
        previewWrapperUrl: $previewWrapperUrl
      }
    ) {
      pageContext {
        id
        name
        contextType
        slot
        renderingTemplate
        selector
        previewWrapperUrl
      }
    }
  }
`;

const UPDATE_PAGE_CONTEXT = gql`
  mutation UpdatePageContext(
    $id: ID!
    $name: String!
    $slot: String!
    $contextType: String!
    $renderingTemplate: String
    $selector: String
    $previewWrapperUrl: String
  ) {
    updatePageContext(
      input: {
        id: $id
        name: $name
        contextType: $contextType
        slot: $slot
        renderingTemplate: $renderingTemplate
        selector: $selector
        previewWrapperUrl: $previewWrapperUrl
      }
    ) {
      pageContext {
        id
        name
        slot
        contextType
        renderingTemplate
        selector
        previewWrapperUrl
      }
    }
  }
`;

interface PageContext {
  name: string;
  id: string;
  contextType: string;
  slot: string;
  renderingTemplate: string;
  previewWrapperUrl: string;
  selector: string;
}

const PageContextWrapper = styled.div`
  height: 33rem;
`;

const HeadlineSection = styled.section`
  padding: 1rem 0;
`;

const SelectWrapper = styled.div`
  margin-bottom: 5%;
`;

interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageContext?: PageContext;
}

const PageContextForm = ({ pageContext, setNewModalOpen, refetch }: Props) => {
  const [values, setValues] = useState({
    id: null,
    name: '',
    contextType: '',
    slot: '',
    renderingTemplate: '',
    selector: '',
    previewWrapperUrl: '',
  });
  const [errors, setErrors] = useState([]);
  const [savePageContext] = pageContext
    ? useMutation(UPDATE_PAGE_CONTEXT)
    : useMutation(CREATE_PAGE_CONTEXT);
  const [title, setTitle] = useState('New page context');
  const [selectedContext, setSelectedContext] = useState(null);
  const options = [
    { value: 'global', label: 'Global' },
    { value: 'category', label: 'Category' },
    { value: 'folder', label: 'Folder' },
  ];

  const handleChange = ({ target: { name, value } }) => {
    setErrors([]);
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };

  const handleContextChange = (selected) => {
    if (selected) {
      let newErrors = [...errors];
      newErrors = newErrors.filter((e) => {
        if (e.field === 'contextSelect' && e.message === 'required') {
          return false;
        }
        return true;
      });
      setErrors(newErrors);

      setSelectedContext(selected);
      const newValues = { ...values };
      newValues.contextType = selected.value;
      setValues(newValues);
    } else {
      setSelectedContext('');
    }
  };

  useEffect(() => {
    if (pageContext) {
      setTitle('Edit page context');
      if (Object.keys(pageContext).length > 0) {
        setValues({
          id: pageContext.id,
          name: pageContext.name,
          slot: pageContext.slot,
          contextType: pageContext.contextType,
          renderingTemplate: pageContext.renderingTemplate,
          previewWrapperUrl: pageContext.previewWrapperUrl,
          selector: pageContext.selector,
        });
        setSelectedContext(options.find((e) => e.value === pageContext.contextType));
      }
    }
  }, []);

  const dialogContent = (values, errors, handleChange) => {
    return (
      <>
        <PageContextWrapper>
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
            value={values.slot}
            onChange={handleChange}
            required
            name="slot"
            label="Slot"
            helperText="The slot ID in SFCC"
            placeholder="slot-01"
          />

          <SelectWrapper>
            <Select
              required
              value={selectedContext}
              onChange={handleContextChange}
              options={options}
            />
          </SelectWrapper>

          <StyledTextField
            value={values.renderingTemplate}
            onChange={handleChange}
            name="renderingTemplate"
            label="Rendering template"
            helperText="The rendering template within SFCC"
            placeholder="slots/content/contentAssetBody.isml"
          />

          <HeadlineSection>
            <h3>Context specific selector and url (Optional)</h3>
            <p>If you dont fill this the default in team settings will be used</p>
          </HeadlineSection>

          <StyledTextField
            value={values.previewWrapperUrl}
            onChange={handleChange}
            name="previewWrapperUrl"
            label="Preview Wrappper Url"
            helperText="Use a url of your website which will serve as the frame for your content"
          />

          <StyledTextField
            value={values.selector}
            onChange={handleChange}
            name="selector"
            label="Selector"
            helperText="The element which matches the selector will be replaced by the cms content"
          />
        </PageContextWrapper>
      </>
    );
  };

  return (
    <MVMDialog
      showDialog={setNewModalOpen}
      title={title}
      content={dialogContent(values, errors, handleChange)}
      mutation={savePageContext}
      mutationVariables={{ ...values }}
      refetch={refetch}
      errors={errors}
      setErrors={setErrors}
      submitButtonState={
        values.name && values.slot && values.contextType ? 'highlight' : 'disabled'
      }
    />
  );
};

export default PageContextForm;
