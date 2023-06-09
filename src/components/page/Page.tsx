import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Collapse, Grid, List, ListItem, ListItemText, TextField } from '@material-ui/core';

import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Tooltip from '../styled/StyledTooltip';
import ScheduleComponent from './schedules/Schedule';
import PageAttributeEditor from './attributes/PageAttributeEditor';
import PageControlMenu from './PageControlMenu';
import {
  CREATE_SCHEDULE,
  GET_PAGE,
  UPDATE_PAGE,
  DELETE_COUNTRY_GROUP_PAGE_REFERENCE,
  SET_PUBLISH_ASSETS,
  GET_COUNTRY_GROUPS,
} from '../../utils/queries';
import Context from './settings/Context';
import Button from '../MVMButton';
import EditableInput from '../MVMEditableInput';
import Spacer from './Spacer';
import Switch from '../MVMSwitch';
import MVMPickerDialog from '../MVMPickerDialog';
import PagePublish from './PagePublish';
import PageComments from './page_comments';
import checkPermission from '../../utils/permission';
import Breadcrumbs from '../folders/BreadCrumbs';

export interface PageQueryResponse {
  page: Page;
  countryGroups: CountryGroup[];
  publishingTargets: PublishingTarget[];
}

export interface PageFolder {
  id: string;
  name: string;
  path: string;
  root: boolean;
  breadcrumbs: [any];
}

export interface PublishingTarget {
  id: string;
  name: string;
}

export interface CountryGroup {
  id: string;
  name: string;
  description: string;
  sites?: any[];
}

export interface Page {
  id: string;
  name: string;
  context: string;
  category: string;
  publishingFolder: string;
  title: null;
  description: null;
  keywords: null;
  url: null;
  safeName: string;
  allLocales: Locale[];
  allowedCountries: AllowedCountry[];
  schedules: Schedule[];
  countryGroups: CountryGroup[];
  publishAssets: boolean;
  pageFolder: PageFolder;
}

export interface AllowedCountry {
  id: string;
  name: string;
  locales: Locale[];
}

export interface Locale {
  locale: string;
  name: string;
}

export interface Schedule {
  id: string;
  startAt: null | string;
  endAt: null | string;
  published: boolean;
  imageUrl: string;
  pageId: string;
  countryGroups: CountryGroup[];
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const SubTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 3px solid #adadad;
  margin-right: 10%;
  padding-bottom: 1rem;
`;

const CountryGroupContainer = styled.div`
  display: flex;
  button {
    margin-right: 10px !important;
  }
`;

const CountryGroupPublishContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  margin: 0 10px;
`;

const PublishButtonContainer = styled.div`
  margin: 15px 0;
`;

const SchedulesList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Schedule = styled.div`
  margin: 10px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HSpacer = styled.div`
  width: 5rem;
`;

const Section = styled.div`
  display: flex;
  margin-right: 10%;
`;

const SchedulesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
`;

const HeaderGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10rem;
`;

const Headline = styled.div`
  & .mvm-editable-input,
  & .mvm-editable-input input {
    font-size: 3rem;
    font-weight: 900;
  }
`;

const PageAttributeEditorWrapper = styled.div`
  margin: 0 10px;
`;

const ScheduleContextWrapper = styled.div`
  margin: 0 10px;
`;
const BreadcrumbsWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const ContentAssetName = styled.div`
  display: flex;
  margin-bottom: 1rem;

  .mvm-editable-input {
    min-width: 10rem;
    margin-left: 1rem;
  }
`;

type PageId = string;

interface PageVars {
  id: PageId;
}

interface PageProps {
  id: string;
  theme: any;
}

// This just shows the schedules for now
// in the future this will be used for all page features
const Page = ({ id, theme }: PageProps) => {
  const [createSchedule] = useMutation(CREATE_SCHEDULE);
  const [deleteCountryGroupPageReference] = useMutation(
    DELETE_COUNTRY_GROUP_PAGE_REFERENCE,
    {
      refetchQueries: [{ query: GET_PAGE, variables: { id } }],
    },
  );
  const [addCountryGroupOpen, setAddCountryGroupOpen] = useState(false);
  const [oldLocalesOpen, setOldLocalesOpen] = useState(false);

  const { loading, data, error, refetch } = useQuery<PageQueryResponse, PageVars>(
    GET_PAGE,
    {
      variables: { id },
    },
  );

  const [updatePage] = useMutation(UPDATE_PAGE);
  const [togglePublishAssets] = useMutation(SET_PUBLISH_ASSETS);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }
  
  if (loading) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Error...</>;
  }
  return (
    <>
      <HeaderGrid>
        <Headline>
          <EditableInput
            value={data.page.name}
            mutation={updatePage}
            mutationVariables={{ id: Number(data.page.id) }}
            mutationUpdateParam="name"
            size="large"
          />
        </Headline>
        <div style={{ display: 'flex' }}>
          {checkPermission('can_edit_pages') && (
            <Button
              label="Edit Page"
              target={`/pages/${id}/en-GB/live-preview`}
              trailingIcon="triangle"
              backgroundColor="#C7E29A"
              buttonState="highlight"
            />
          )}
          <Button
            label="Preview"
            target={`/pages/${id}/en/view-only-live-preview`}
            trailingIcon="triangle"
            backgroundColor="#646464"
            buttonState="highlight"
          />
        </div>
        <Context page={data.page} />
      </HeaderGrid>
      <BreadcrumbsWrapper>
        <Breadcrumbs breadcrumbs={data.page.pageFolder.breadcrumbs} />
        <StyledLink
          to={data.page.pageFolder.root ? '/page_folders' : data.page.pageFolder.path}
        >
          {data.page.pageFolder.name}
        </StyledLink>
      </BreadcrumbsWrapper>
      <PageControlMenu
        page={data.page}
        editingCountries={data.page.allowedCountries}
        publishingTargets={data.publishingTargets}
      />
      <Spacer factor={1} />
      <div>
        {data.page.publishingLocales.length > 0 && (
          <Section>
            <div>
              <SubTitle>Old Publishing Locales</SubTitle>
              <p>These are the old locales used for publishing content assets: </p>
              <ListItem button onClick={() => setOldLocalesOpen(!oldLocalesOpen)}>
                <ListItemText primary="Locales" />
                {oldLocalesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={oldLocalesOpen}>
                <List>
                  {data.page.publishingLocales.map((locale) => (
                    <ListItem key={locale.locale}>{locale.locale}</ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          </Section>
        )}
        <Section>
          <SchedulesWrapper>
            <Tooltip title="Creates a new content slot configuration when published">
              <SubTitle>Publishing as Schedules</SubTitle>
            </Tooltip>
            <ScheduleContextWrapper>
              <FlexWrapper>
                <Tooltip title="When should your page be online? Add a schedule here and assign modules to it in the LiveEditor">
                  <span>
                    <Button
                      label="Add Schedule"
                      onClick={() => {
                        createSchedule({ variables: { pageId: data.page.id } }).then(() =>
                          refetch(),
                        );
                      }}
                    />
                  </span>
                </Tooltip>
                <Switch
                  label="Publish Images"
                  isOn={data.page.publishAssets}
                  handleToggle={() => {
                    togglePublishAssets({
                      variables: {
                        pageId: data.page.id,
                        publishAssets: !data.page.publishAssets,
                      },
                    }).then(() => refetch());
                  }}
                />
              </FlexWrapper>
            </ScheduleContextWrapper>
            <Spacer factor={2} />
            <SchedulesList>
              {data.page.schedules.map((schedule) => (
                <Schedule key={schedule.id} data-schedule-id={schedule.id}>
                  <ScheduleComponent
                    page={data.page}
                    schedule={schedule}
                    refetch={refetch}
                  />
                </Schedule>
              ))}
            </SchedulesList>
          </SchedulesWrapper>
          <PageComments pageId={data.page.id} />
        </Section>
        <section>
          <Tooltip title="Creates a single content asset with all the modules on the page">
            <SubTitle>Publish as Content Asset</SubTitle>
          </Tooltip>
          <ContentAssetName>
            Content asset will be called:
            <EditableInput
              value={data.page.context ? data.page.context : data.page.safeName}
              mutation={updatePage}
              mutationVariables={{
                id: Number(data.page.id),
              }}
              mutationUpdateParam="context"
              size="small"
            />
          </ContentAssetName>
          <ContentAssetName>
            Assign to folder:
            <EditableInput
              value={data.page.publishingFolder ? data.page.publishingFolder : ''}
              mutation={updatePage}
              mutationVariables={{
                id: Number(data.page.id),
              }}
              mutationUpdateParam="publishingFolder"
              size="small"
            />
          </ContentAssetName>
          <CountryGroupPublishContainer>
            {data.page.countryGroups.length > 0 ? (
              <CountryGroupContainer>
                {data.page.countryGroups.map((cg) => (
                  <Button
                    label={cg.name}
                    key={cg.id}
                    aria-label="edit"
                    trailingIcon="close"
                    onClick={() => {
                      deleteCountryGroupPageReference({
                        variables: {
                          pageID: data.page.id,
                          countryGroupID: cg.id,
                        },
                      });
                    }}
                  />
                ))}
                <Button
                  label="Add country group"
                  onClick={() => {
                    setAddCountryGroupOpen(true);
                  }}
                  leadingIcon="add"
                />
              </CountryGroupContainer>
            ) : (
              <Button
                label="Add Country Groups"
                onClick={() => {
                  setAddCountryGroupOpen(true);
                }}
              />
            )}
            {addCountryGroupOpen && (
              <MVMPickerDialog
                showDialog={setAddCountryGroupOpen}
                update={updatePage}
                target={data.page}
                targetItems={data.page.countryGroups}
                refetch={refetch}
                query={GET_COUNTRY_GROUPS}
                itemName="country groups"
                itemVariableName="countryGroups"
                dialogTitle="Select a country group to add"
                createNewItemPath="/settings/country-groups"
              />
            )}
            <FlexWrapper>
              <div style={{ marginTop: '20px' }}>
                <PagePublish
                  pageId={data.page.id}
                  pageContext={data.page.context ? data.page.context : data.page.safeName}
                  countryGroups={data.page.countryGroups}
                  name={name}
                  description={description}
                />
              </div>
              <Switch
                label="Publish Images"
                isOn={data.page.publishAssets}
                handleToggle={() => {
                  togglePublishAssets({
                    variables: {
                      pageId: data.page.id,
                      publishAssets: !data.page.publishAssets,
                    },
                  }).then(() => refetch());
                }}
              />
            </FlexWrapper>
          </CountryGroupPublishContainer>
        </section>

        <section>
          <SubTitle>Page Attributes</SubTitle>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <PageAttributeEditorWrapper>
                <PageAttributeEditor page={data.page} theme={theme} />
              </PageAttributeEditorWrapper>
            </Grid>
            <Grid item xs={4}>
                <TextField id="outlined-basic" label="Name" variant="outlined" onChange={handleNameChange} />
                <br />
                <br />
                <TextField id="outlined-basic" label="Description" variant="outlined" onChange={handleDescriptionChange} />
            </Grid>
          </Grid>
         

          
        </section>
        <div>
            <div>
              <SubTitle>Page History</SubTitle>
              <br />
              <p>{data?.page.createdAt} page created by {data?.page.createdBy}</p>
              <p>{data?.page.updatedAt} page content edited by {data?.page.updatedBy}</p>
              { data?.page.lastPublished ? <p>{data?.page.lastPublished} last published by { data?.page.publishedBy }</p> : null }
              { data?.page.duplicatedFromPage ? <p>{data?.page.duplicatedFromPage} duplicated page from {data?.page.duplicatedFromPageLink} by {data?.page.createdBy}</p>: null }
              { data?.page.lastSentToTranslation ? <p>{data?.page.lastSentToTranslation} last sent to translation by {data?.page.sentToTranslationBy}</p>: null }
              { data?.page.lastImportedTranslation ?<p>{data?.page.lastImportedTranslation} last imported translation by {data?.page.translationImportedBy}</p>: null }
              { data?.page.deletedFromArchive ? <p>{data?.page.deletedFromArchive} deleted page and moved to archive folder by {data?.page.deletedFromArchiveBy}</p>: null }
            </div>
        </div>
      </div>
    </>
  );
};

export default Page;
