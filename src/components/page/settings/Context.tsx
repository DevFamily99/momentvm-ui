import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import { MenuItem, InputLabel } from '@material-ui/core';
import { Link } from 'gatsby';
import { GET_PAGE_CONTEXTS, UPDATE_PAGE } from '../../../utils/queries';
import EditableInput from '../../MVMEditableInput';
import Tooltip from '../../styled/StyledTooltip';
import { Page } from '../Page';

export interface CountryGroup {
  id: string;
  name: string;
  description: string;
}

export interface PageContext {
  name: string;
  id: string;
  contextType: string;
  slot: string;
  renderingTemplate: string;
  previewWrapperUrl: string;
  selector: string;
}

const PageContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const SettingText = styled.p`
  margin-right: 10px;
`;

const CategoryField = styled.div`
  margin-top: 10px;
`;

interface Props {
  page: Page;
}

const Context = ({ page }: Props) => {
  const [pageContextId, setPageContextId] = useState(() => {
    if (page.pageContext) {
      return page.pageContext.id;
    }
    return '';
  });
  const [currentContextType, setCurrentContextType] = useState(() => {
    if (page.pageContext) {
      return page.pageContext.contextType;
    }
    return '';
  });

  const { data, loading, error } = useQuery(GET_PAGE_CONTEXTS);
  const [updatePage] = useMutation(UPDATE_PAGE);

  const handleChange = async (e) => {
    const { value } = e.target;
    // run mutation on page
    setPageContextId(value);
    const response = await updatePage({
      variables: { id: page.id, pageContextId: value },
    });
    setCurrentContextType(response.data.updatePage.page.pageContext.contextType);
  };

  if (loading) {
    return null;
  }
  return (
    <PageContextWrapper>
      <Tooltip
        placement="top"
        arrow
        interactive
        title={
          <>
            Create a new publishing context{' '}
            <Link
              style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}
              to="/settings/page-contexts"
            >
              here
            </Link>
          </>
        }
      >
        <SettingText>SFCC context:</SettingText>
      </Tooltip>
      <Select
        id="pageContextSelect"
        onChange={(e) => handleChange(e)}
        value={pageContextId}
        displayEmpty
      >
        {!data.pageContexts.length && (
          <MenuItem disabled>Create a Publishing Context in the settings.</MenuItem>
        )}
        {data.pageContexts.map((pc: { id: string; name: string }) => (
          <MenuItem className="contextOption" key={pc.id} value={pc.id}>
            {pc.name}
          </MenuItem>
        ))}
      </Select>
      {currentContextType.match(/category/i) && (
        <Tooltip title="Add a category from your Salesforce Business Manager. To use multiple categories seperate them with a comma and a space.">
          <CategoryField>
            <InputLabel>Category</InputLabel>
            <EditableInput
              value={page.category || 'category FOO'}
              mutation={updatePage}
              mutationVariables={{ id: Number(page.id) }}
              mutationUpdateParam="category"
              size="small"
            />
          </CategoryField>
        </Tooltip>
      )}
    </PageContextWrapper>
  );
};

export default Context;
