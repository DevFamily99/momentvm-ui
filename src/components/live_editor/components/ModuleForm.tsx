import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Form from '@rjsf/core';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';
import {
  GET_PAGE_MODULE,
  UPDATE_PAGE_MODULE,
  DELETE_PAGE_MODULE,
  GET_PAGES_MODULES,
} from '../../../utils/queries';
// import Button from '../../src/components/Button';
import Button from '../../MVMButton';
import Permissions from './ModulePermissions';
import Schedules from './Schedules';
import {
  TextField,
  SelectField,
  DateField,
  LocalizedField,
  PlainTextLocalizedField,
  ImageField,
  NestedTemplateField,
  ArrayFieldTemplate,
  FieldTemplate,
} from './widgets';
import FormLoading from './FormLoading';
import checkPermission from '../../../utils/permission';

const widgets = {
  localized: LocalizedField,
  plainTextLocalized: PlainTextLocalizedField,
  imageSearch: ImageField,
  nestedTemplate: NestedTemplateField,
  TextWidget: TextField,
  DateWidget: DateField,
  SelectWidget: SelectField,
};

const SmallText = styled.p`
  font-size: 0.7rem;
  color: #b6b6b6;
  font-family: monospace;
  padding-top: 0;
  margin-top: -1rem;
  padding-bottom: 1rem;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column-reverse;
`;

const Wrapper = styled.div`
  .mvm-button > div {
    font-size: 0.8rem;
    background-color: #d8d8d8;
    color: black;
  }
  .mvm-button {
    margin-bottom: 10px;
  }
  .mvm-button p {
    color: black;
  }
  form .mvm-button {
    margin-top: 1rem;
  }
  form .mvm-button > div {
    background-color: black;
    color: white;
    font-size: 1rem;
  }
`;
/**
 * Main form component
 * @param pageId string
 * @param pageModuleId string
 * @param pageModuleId function - sets the page module being edited in the form
 * @param reloadPreview function - reloads the iframe
 * @param setNewModuleOpen function - toggles the ui to add a new module, close on form open
 * @param setReorderListOpenfunction - toggles the ui to reorder modules, close on form open
 */

const ModuleForm = ({
  pageId,
  pageModuleId,
  setPageModuleId,
  reloadPreview,
  setNewModuleOpen,
  setReorderListOpen,
}) => {
  const [pageModule, setPageModule] = useState(null);
  const [formTouched, setFormTouched] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [schedulesOpen, setSchedulesOpen] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const [updatePageModule] = useMutation(UPDATE_PAGE_MODULE, {});
  const [deletePageModule] = useMutation(DELETE_PAGE_MODULE, {
    refetchQueries: [{ query: GET_PAGES_MODULES, variables: { id: pageId } }],
  });

  // reset form state if pageModule changed
  useEffect(() => {
    setFormTouched(false);
    setPageModule(null);
  }, [pageModuleId]);

  const { refetch } = useQuery(GET_PAGE_MODULE, {
    variables: { pageModuleId },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setPageModule(data.pageModule);
      setNewModuleOpen(false);
      setReorderListOpen(false);
    },
  });

  const onSubmit = async ({ formData }) => {
    await updatePageModule({
      variables: { id: pageModuleId, pageModuleBody: formData },
    });
    setFormTouched(false);
    refetch();
    reloadPreview();
    toast.success('Page Module Updated.');
  };
  if (!pageModule) {
    return <FormLoading />;
  }

  if (!pageModule.permission) {
    return <p>You dont have permission to edit this module</p>;
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const { data } = await deletePageModule({ variables: { id: pageModuleId } });
      if (data) {
        toast.success('Module has been deleted.');
        reloadPreview();
      }
    }
  };

  const takeScreenshot = (pageModuleId) => {
    axios
      .post(`${process.env.GATSBY_API_URL}/api/template_thumbnail`, {
        page_module_id: pageModuleId,
        page_id: pageId,
      })
      .then((res) => {
        toast.success(res.data.message);
      });
    toast.info('Generating thumbnail...');
  };

  /**
   * known library issue, form resets its state if the parent rerenders
   * check if the form has been edited, and pass its own state as a prop to prevent this
   *  */
  const getFormData = () => {
    if (formRef && formTouched) {
      return formRef.state.formData;
    }
    return pageModule.body;
  };
  return (
    <Wrapper>
      <h2>{pageModule.template.name}</h2>
      <SmallText>{pageModule.id}</SmallText>
      {checkPermission('can_edit_module_permissions') && (
        <Button
          label="Permissions"
          onClick={() => setPermissionsOpen(true)}
          backgroundColor="#000000"
        />
      )}
      <Button
        label="Assign module to a schedule"
        onClick={() => setSchedulesOpen(true)}
      />
      <Button label="Save as thumbnail" onClick={() => takeScreenshot(pageModuleId)} />
      <Button label="Delete module" onClick={() => handleDelete()} />

      <StyledForm
        schema={{ type: 'object', properties: pageModule.template.schema }}
        onChange={() => setFormTouched(true)}
        formData={getFormData()}
        uiSchema={pageModule.template.uiSchema || {}}
        widgets={widgets}
        ArrayFieldTemplate={ArrayFieldTemplate}
        FieldTemplate={FieldTemplate}
        noValidate
        onSubmit={onSubmit}
        ref={(ref) => setFormRef(ref)}
        formContext={{
          pageModuleId,
          setPageModuleId,
          formRef,
          reloadPreview,
        }}
      >
        <Button
          type="submit"
          label="Save"
          trailingIcon="triangle"
          submit
          backgroundColor="red"
        />
      </StyledForm>
      {permissionsOpen && (
        <Permissions
          pageModuleId={pageModuleId}
          setPermissionsOpen={setPermissionsOpen}
        />
      )}
      {schedulesOpen && (
        <Schedules pageModuleId={pageModuleId} setSchedulesOpen={setSchedulesOpen} />
      )}
    </Wrapper>
  );
};

export default ModuleForm;
