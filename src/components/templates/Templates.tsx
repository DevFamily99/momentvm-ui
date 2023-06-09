import React, { useState, FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { Link } from 'gatsby';
import Select from 'react-select';
import Switch from '../MVMSwitch';
import Button from '../MVMButton';
import { GET_TAGS, GET_TEMPLATES } from '../../utils/queries';
import DeleteTemplate from './DeleteTemplate';
import ImportTemplates from './ImportTemplates';
import MVMImage from '../MVMImage';
import FolderSvg from '../../images/folder.svg';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const TemplateListWrapper = styled.div``;
const TemplatesList = styled.div`
  //display: flex;
  flex-direction: column;
  margin: 2rem 0;

  &.grid {
    // flex-direction: row;
    // flex-wrap: wrap;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

const TemplateListItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  width: 50%;

  &.grid {
    width: 300px;
    height: 330px;
    margin-right: 2rem;
    flex-wrap: nowrap;
    .delete {
      display: none;
    }
  }
`;
const TemplateListItemName = styled.div`
  font-weight: bold;
  width: 12rem;
  word-break: break-all;

  &.grid {
    text-align: center;
  }
`;

const TemplateLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  &:hover {
    cursor: pointer;
  }

  &.grid {
    flex-direction: column;
  }
`;

const TemplateImage = styled.div`
  margin: 0 2rem;
  width: 200px;
  height: 150px;

  img {
    width: 100%;
  }

  &.grid {
    width: 300px;
    height: 230px;
    min-height: 230px;
    min-width: 300px;
    margin: 1rem 0;

    img {
      object-fit: contain;
      width: 300px;
      height: 230px;
    }
  }
`;

const TemplateActions = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  margin-top: 2rem;

  .mvm-switch {
    min-width: 10rem;
  }
`;

const ArchiveLabel = styled.div`
  font-weight: bold;
  text-align: center;
  width: 12rem;
  margin: auto;
  word-break: break-all;
`;

const SelectWrapper = styled.div`
  width: 30rem;
  margin-top: 2rem;
`;

const ViewDocBtn = styled.div`
  display: flex;
  align-items: center;
`;

const TemplateArchiveFolder: FunctionComponent = () => {
  return (
    <TemplateListItem>
      <StyledLink to="/templates/archive">
        <TemplateImage>
          <FolderSvg width="100%" height="100%" />
        </TemplateImage>
        <ArchiveLabel>Archive</ArchiveLabel>
      </StyledLink>
    </TemplateListItem>
  );
};

const Templates: FunctionComponent = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [showGridView, setShowGridView] = useState(true);
  const [importTemplates, showImportTemplates] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_TEMPLATES, {
    variables: { archived: false },
  });

  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  const { data: tagsData } = useQuery(GET_TAGS);

  const exportTemplatesLink = `${
    process.env.GATSBY_API_URL
  }/api/templates/download?apiToken=${localStorage.getItem('apiToken')}`;

  const handleFilterChange = (selected) => {
    const newOptions = selected === null ? [] : selected;
    setFilteredTags(newOptions);
  };

  const filterTemplates = () => {
    const templates = data.templates.filter((template) =>
      template.tags.some((item) => filteredTags.find((t) => t.value === item.id)),
    );
    setFilteredTemplates(templates);
  };

  useEffect(() => {
    if (data) {
      setFilteredTemplates(data.templates);
      if (filteredTags.length > 0) {
        filterTemplates();
      }
    }
  }, [filteredTags, data]);

  if (loading) return <>Loading</>;
  if (error) return <>Error</>;
  return (
    <>
      <h1>Templates</h1>
      <div className="template-descriptions">
        <p>Templates are a blueprint for page modules.</p>
        <p>
          Template schemas belong to a template and tells the editor which fields should
          be editable in the template.
        </p>
        <p>
          If you have any questions about the process or you need help with the setup,
          please contact us: <a href="mailto:cms@momentvm.com"> cms@momentvm.com </a>
        </p>
        <ViewDocBtn>
          <p>See how easy it is to create templates:</p>
          <Button
            label="View documentation"
            target={`${process.env.GATSBY_DOCUMENTATION_URL}/development/development`}
          />
        </ViewDocBtn>
      </div>
      <TemplateActions className="template-actions">
        <StyledLink to="/templates/new">
          <Button label="Create new template" buttonState="highlight" />
        </StyledLink>

        {showGridView && (
          <Button
            label="Print templates"
            buttonState="highlight"
            onClick={() => {
              if (showGridView) {
                window.print();
              }
            }}
          />
        )}

        <Button
          label="Download all templates"
          buttonState="highlight"
          target={exportTemplatesLink}
        />

        <Button
          label="Import Templates"
          buttonState="highlight"
          onClick={() => showImportTemplates(true)}
        />
        {importTemplates && (
          <ImportTemplates
            showImportTemplates={showImportTemplates}
            refetchTemplates={refetch}
          />
        )}

        <Switch
          label="Show Grid View"
          isOn={showGridView}
          handleToggle={() => {
            setShowGridView(!showGridView);
          }}
        />
      </TemplateActions>

      <SelectWrapper>
        <Select
          required
          value={filteredTags.map((u) => ({ value: u.value, label: u.label }))}
          onChange={handleFilterChange}
          options={tagsData.tags.map((u) => ({ value: u.id, label: u.name }))}
          isMulti
          isSeachable
          placeholder="Filter templates by tags"
          style={{ width: '100%' }}
        />
      </SelectWrapper>

      <TemplateListWrapper>
        <TemplatesList className={showGridView ? 'grid' : ''}>
          <TemplateArchiveFolder />
          {filteredTemplates.map((template) => (
            <TemplateListItem
              key={template.id}
              className={showGridView ? 'grid grid-item' : ''}
            >
              <StyledLink to={`/templates/${template.id}`}>
                <TemplateLink className={showGridView ? 'grid' : ''}>
                  <TemplateImage className={showGridView ? 'grid' : ''}>
                    <MVMImage alt="templateImage" src={template.imageUrl} />
                  </TemplateImage>
                  <TemplateListItemName className={showGridView ? 'grid' : ''}>
                    {template.name}
                  </TemplateListItemName>
                </TemplateLink>
              </StyledLink>
              <Button
                label="Delete"
                buttonState="delete"
                onClick={() => {
                  setDeleteModalOpen(true);
                  setTemplateToDelete(template);
                }}
              />
            </TemplateListItem>
          ))}
        </TemplatesList>
        {deleteModalOpen && (
          <DeleteTemplate
            setDeleteModalOpen={setDeleteModalOpen}
            template={templateToDelete}
            refetch={refetch}
          />
        )}
      </TemplateListWrapper>
    </>
  );
};

export default Templates;
