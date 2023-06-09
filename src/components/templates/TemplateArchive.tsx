import React, { useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { Link, navigate } from 'gatsby';
import Switch from '../MVMSwitch';
import Button from '../MVMButton';
import { GET_TEMPLATES } from '../../utils/queries';
import DeleteTemplate from './DeleteTemplate';
import MVMImage from '../MVMImage';

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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

const TemplateArchive: FunctionComponent = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [showGridView, setShowGridView] = useState(true);

  const { data, loading, error, refetch } = useQuery(GET_TEMPLATES, {
    variables: { archived: true },
  });

  if (loading) return <>Loading</>;
  if (error) return <>Error</>;
  return (
    <>
      <h1>Templates Archive</h1>
      <div className="template-descriptions">
        <p>
          Templates here have not been updated on a page in 12 months. To unarchive a
          template simply use it in a page.
        </p>
      </div>

      <TemplateActions className="template-actions">
        <Button label="Back" onClick={() => navigate('/templates/')} />
        <Button
          label="Print templates"
          buttonState="highlight"
          onClick={() => {
            if (showGridView) {
              window.print();
            }
          }}
        />

        <Switch
          label="Show Grid View"
          isOn={showGridView}
          handleToggle={() => {
            setShowGridView(!showGridView);
          }}
        />
      </TemplateActions>

      <TemplateListWrapper>
        <TemplatesList className={showGridView ? 'grid' : ''}>
          {data.templates.map((template) => (
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

export default TemplateArchive;
