import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { Template } from './Module';
import CloseButton from '../../CloseButton';
import Button from '../../Button';
import CopyModules from './copyModules/CopyModules';

export const TEMPLATE_SEARCH = gql`
  query TemplateSearch($query: String) {
    templateSearch(query: $query) {
      id
      name
      imageUrl
      archived
    }
  }
`;

const ReorderModulesHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderText = styled.div`
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Nunito Sans', sans-serif;
  margin-right: 1vw;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  /* flex: 1; */
  width: 100%;
`;
const ModuleSearchContainer = styled.div`
  width: 70%;
`;
const ModuleSearchInputCloseHolder = styled.div``;

const AddNewModule = ({ setNewModuleOpen }) => {
  const [templates, setTemplates] = useState([]);
  const [query, setQuery] = useState('');
  const [copyModuleOpen, setCopyModuleOpen] = useState(false);
  useQuery(TEMPLATE_SEARCH, {
    variables: { query },
    onCompleted: (data) => {
      setTemplates(data.templateSearch);
    },
  });

  const unArchivedTemplates = templates.filter((template) => template.archived !== true);
  const archivedTemplates = templates.filter((template) => template.archived === true);

  return (
    <>
      <ReorderModulesHeading>
        <HeaderText>
          <h3>MODULE PREVIEW</h3>
          <p>Drag and drop a module into the page</p>
          <CloseButton func={() => setNewModuleOpen(false)} />
        </HeaderText>

        {!copyModuleOpen && (
          <Wrapper>
            <ModuleSearchContainer>
              <ModuleSearchInputCloseHolder>
                <TextField
                  id="page-searchbar"
                  placeholder="Search templates by name or tags..."
                  inputProps={{ 'aria-label': 'search modules' }}
                  onChange={(e) => setQuery(e.target.value)}
                  fullWidth
                />
              </ModuleSearchInputCloseHolder>
            </ModuleSearchContainer>

            <Button onClick={() => setCopyModuleOpen(true)} text="Copy existing module" />
          </Wrapper>
        )}
      </ReorderModulesHeading>

      {copyModuleOpen && <CopyModules hide={() => setCopyModuleOpen(false)} />}

      {!copyModuleOpen && (
        <>
          <div>
            {unArchivedTemplates.map((template) => (
              <Template
                id={template.id}
                key={template.id}
                name={template.name}
                imageUrl={template.imageUrl}
              />
            ))}
          </div>
          {archivedTemplates.length > 0 && (
            <div>
              <h2>Archived Templates</h2>
              {archivedTemplates.map((template) => (
                <Template
                  id={template.id}
                  key={template.id}
                  name={template.name}
                  imageUrl={template.imageUrl}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AddNewModule;
