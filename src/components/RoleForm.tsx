import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import StyledTooltip from './styled/StyledTooltip';
import StyledTextField from './styled/StyledTextField';
import MVMDialog from './MVMDialog';
import Switch from './MVMSwitch';

const CREATE_ROLE = gql`
  mutation CreateRole(
    $name: String!
    $body: JSON!
    $can_create_pages: Boolean!
    $can_edit_pages: Boolean!
    $can_approve_pages: Boolean!
    $can_see_advanced_menu: Boolean!
    $can_edit_templates: Boolean!
    $can_see_language_preview: Boolean!
    $can_see_country_preview: Boolean!
    $can_unpublish_pages: Boolean!
    $can_publish_pages: Boolean!
    $can_edit_settings: Boolean!
    $can_see_settings: Boolean!
    $can_edit_all_modules_by_default: Boolean!
    $can_edit_module_permissions: Boolean!
    $can_copy_modules: Boolean!
    $can_duplicate_page: Boolean!
    $users: [JSON!]
  ) {
    createRole(
      input: {
        name: $name
        body: $body
        canCreatePages: $can_create_pages
        canEditPages: $can_edit_pages
        canApprovePages: $can_approve_pages
        canSeeAdvancedMenu: $can_see_advanced_menu
        canEditTemplates: $can_edit_templates
        canSeeLanguagePreview: $can_see_language_preview
        canSeeCountryPreview: $can_see_country_preview
        canUnpublishPages: $can_unpublish_pages
        canPublishPages: $can_publish_pages
        canEditSettings: $can_edit_settings
        canSeeSettings: $can_see_settings
        canEditAllModulesByDefault: $can_edit_all_modules_by_default
        canEditModulePermissions: $can_edit_module_permissions
        canCopyModules: $can_copy_modules
        canDuplicatePage: $can_duplicate_page
        users: $users
      }
    ) {
      role {
        id
      }
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateRole(
    $id: ID!
    $name: String!
    $body: JSON!
    $can_create_pages: Boolean!
    $can_edit_pages: Boolean!
    $can_approve_pages: Boolean!
    $can_see_advanced_menu: Boolean!
    $can_edit_templates: Boolean!
    $can_see_language_preview: Boolean!
    $can_see_country_preview: Boolean!
    $can_unpublish_pages: Boolean!
    $can_publish_pages: Boolean!
    $can_edit_settings: Boolean!
    $can_see_settings: Boolean!
    $can_edit_all_modules_by_default: Boolean!
    $can_edit_module_permissions: Boolean!
    $can_copy_modules: Boolean!
    $can_duplicate_page: Boolean!
    $users: [JSON!]
  ) {
    updateRole(
      input: {
        id: $id
        name: $name
        body: $body
        canCreatePages: $can_create_pages
        canEditPages: $can_edit_pages
        canApprovePages: $can_approve_pages
        canSeeAdvancedMenu: $can_see_advanced_menu
        canEditTemplates: $can_edit_templates
        canSeeLanguagePreview: $can_see_language_preview
        canSeeCountryPreview: $can_see_country_preview
        canUnpublishPages: $can_unpublish_pages
        canPublishPages: $can_publish_pages
        canEditSettings: $can_edit_settings
        canSeeSettings: $can_see_settings
        canEditAllModulesByDefault: $can_edit_all_modules_by_default
        canEditModulePermissions: $can_edit_module_permissions
        canCopyModules: $can_copy_modules
        canDuplicatePage: $can_duplicate_page
        users: $users
      }
    ) {
      role {
        id
      }
    }
  }
`;

interface Role {
  name: string;
  id: string;
  body: object;
  canCreatePages: boolean;
  canEditPages: boolean;
  canApprovePages: boolean;
  canSeeAdvancedMenu: boolean;
  canEditTemplates: boolean;
  canSeeLanguagePreview: boolean;
  canSeeCountryPreview: boolean;
  canUnpublishPages: boolean;
  canPublishPages: boolean;
  canEditSettings: boolean;
  canSeeSettings: boolean;
  canEditAllModulesByDefault: boolean;
  canEditModulePermissions: boolean;
  canCopyModules: boolean;
  canDuplicatePage: boolean;
  users: Array<any>;
}

const RoleWrapper = styled.div`
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
  role?: Role;
  allSkills?: Array<any>;
  users?: Array<any>;
}

const RoleForm = ({ role, allSkills, users, setNewModalOpen, refetch }: Props) => {
  const [values, setValues] = useState({
    id: '',
    name: '',
    body: {},
    can_create_pages: false,
    can_edit_pages: false,
    can_approve_pages: false,
    can_see_advanced_menu: false,
    can_edit_templates: false,
    can_see_language_preview: false,
    can_see_country_preview: false,
    can_unpublish_pages: false,
    can_publish_pages: false,
    can_edit_settings: false,
    can_see_settings: false,
    can_edit_all_modules_by_default: false,
    can_edit_module_permissions: false,
    can_copy_modules: false,
    can_duplicate_page: false,
    users: [],
  });
  const [errors, setErrors] = useState([]);
  const [saveRole] = role ? useMutation(UPDATE_ROLE) : useMutation(CREATE_ROLE);
  const [title, setTitle] = useState('New Role');

  const handleChange = ({ target: { name, value } }) => {
    setErrors([]);
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };

  // skill = {can_edit: "yes"}
  const handleToggleSkill = (skill) => {
    const skillKey = Object.keys(skill)[0];
    setValues({ ...values, [skillKey]: !!!values[skillKey] });
  };

  const handleUserChange = (selected) => {
    const newOptions = selected === null ? [] : selected;
    setValues({
      ...values,
      users: newOptions.map((opt) => ({ id: opt.value, email: opt.label })),
    });
  };
  /* Checks if a skill like 'can_publish_pages' is true or false in a given object */
  const hasSkill = (
    skillToCheck: string,
    allSkills: { [key: string]: boolean },
  ): boolean => {
    if (Object.keys(allSkills).length === 0) {
      return false;
    }
    return allSkills[skillToCheck];
  };

  useEffect(() => {
    if (role) {
      setTitle('Edit Role');
      if (Object.keys(role).length > 0) {
        setValues({
          id: role.id,
          name: role.name,
          body: role.body,
          can_create_pages: role.canCreatePages,
          can_edit_pages: role.canEditPages,
          can_approve_pages: role.canApprovePages,
          can_see_advanced_menu: role.canSeeAdvancedMenu,
          can_edit_templates: role.canEditTemplates,
          can_see_language_preview: role.canSeeLanguagePreview,
          can_see_country_preview: role.canSeeCountryPreview,
          can_unpublish_pages: role.canUnpublishPages,
          can_publish_pages: role.canPublishPages,
          can_edit_settings: role.canEditSettings,
          can_see_settings: role.canSeeSettings,
          can_edit_all_modules_by_default: role.canEditAllModulesByDefault,
          can_edit_module_permissions: role.canEditModulePermissions,
          can_copy_modules: role.canCopyModules,
          can_duplicate_page: role.canDuplicatePage,
          users: role.users,
        });
      }
    }
  }, []);
  const dialogContent = (values, errors, handleChange) => {
    return (
      <RoleWrapper>
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
            placeholder="Manager"
          />
        </StyledTooltip>
        <p>Access</p>
        <div>
          {allSkills.map((skill) => (
            <div style={{ marginBottom: '10px' }} key={Object.keys(skill)[0]}>
              <Switch
                isOn={values[Object.keys(skill)[0]]}
                handleToggle={() => handleToggleSkill(skill)}
                label={Object.keys(skill)[0].replace(/_/g, ' ')}
              />
            </div>
          ))}
        </div>
        <SelectWrapper>
          <p>Users</p>
          <Select
            required
            value={values.users.map((u) => ({ value: u.id, label: u.email }))}
            onChange={handleUserChange}
            options={users.map((u) => ({ value: u.id, label: u.email }))}
            isMulti
            isSeachable
          />
        </SelectWrapper>
      </RoleWrapper>
    );
  };

  return (
    <MVMDialog
      showDialog={setNewModalOpen}
      title={title}
      content={dialogContent(values, errors, handleChange)}
      mutation={saveRole}
      mutationVariables={{ ...values }}
      refetch={refetch}
      errors={errors}
      setErrors={setErrors}
      submitButtonState={values.name ? 'highlight' : 'disabled'}
    />
  );
};

export default RoleForm;
