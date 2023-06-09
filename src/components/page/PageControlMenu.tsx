import { gql, useMutation } from '@apollo/client';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import jwtDecode from 'jwt-decode';
import { navigate } from 'gatsby';
import Button from '../MVMButton';
import Tabs, { Content } from '../MVMTabs';
import DeletePage from './DeletePage';
import ImportTranslations from './ImportTranslations';
import { Page } from './Page';
import TranslationStatus from './TranslationStatus';

export interface AllowedCountry {
  id: string;
  name: string;
  locales: Locale[];
}

export interface Locale {
  locale: string;
  name: string;
}

export interface PublishingTarget {
  id: string;
  name: string;
}

const Wrapper = styled.div`
  min-height: 12rem;
  h3 {
    padding-bottom: 0.5rem;
  }
`;

interface SpacerProps {
  factor: number;
}
// Temporary fix
const Spacer = styled.div`
  height: ${(props: SpacerProps) => props.factor}rem;
`;

const DUPLICATE_PAGE = gql`
  mutation DuplicatePage($pageId: ID) {
    duplicatePage(input: { pageId: $pageId }) {
      page {
        id
      }
    }
  }
`;

const BLUEPRINT_PAGE = gql`
  mutation BlueprintPage($pageId: ID) {
    blueprintPage(input: { pageId: $pageId }) {
      blueprint {
        id
      }
    }
  }
`;

interface PageControlMenuProps {
  page: Page;
  editingCountries: AllowedCountry[];
  publishingTargets: PublishingTarget[];
}
/**
 * The Page Control Menu is the menu with all the workflow options for a page
 * which is visible on the page show
 * @param props PageControlMenuProps
 */
const PageControlMenu: FunctionComponent<PageControlMenuProps> = ({
  page,
  editingCountries,
  publishingTargets,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importTranslationsOpen, setImportTranslationsOpen] = useState(false);
  const [duplicatePage] = useMutation(DUPLICATE_PAGE);
  const [blueprintPage] = useMutation(BLUEPRINT_PAGE);
  const jwt = localStorage.getItem('apiToken');
  const user = jwtDecode(jwt);

  return (
    <Wrapper>
      <Spacer factor={2} />
      <Tabs>
        <Content label="Translation Workflow">
          <Button
            label="Download Translations"
            target={`${process.env.GATSBY_API_URL}/api/pages/${
              page.id
            }/export_translations?apiToken=${localStorage.getItem('apiToken')}`}
          />
          <Button
            label="Import Translations"
            onClick={() => setImportTranslationsOpen(true)}
          />
          {/* <Button
            label="Reset Translation Status"
            target={`/pages/reset_translation_status/${page.id}`}
          />
          <Button
            label="Send to Translation Validation"
            target={`/pages/${page.id}/send_to_translation_validation`}
          />
          <Button
            label="Send to Translation"
            target="/workflow/send_translations_start"
          />
          <Button
            label={
              <a
                href="/workflow/check_finished_translations_start"
                data-confirm="Are you sure? This will override translations"
              >
                Fetch finished Translation
              </a>
            }
          /> */}
          <TranslationStatus pageId={page.id} />
        </Content>
        <Content label="More">
          {user.skills.can_duplicate_page && (
            <Button
              label="Duplicate Page"
              buttonState={user.skills.can_duplicate_page ? 'default' : 'disabled'}
              onClick={async () => {
                const { data } = await duplicatePage({ variables: { pageId: page.id } });
                navigate(`/pages/${data.duplicatePage.page.id}`);
              }}
            />
          )}
          <Button
            label="Download Page XML"
            target={`${process.env.GATSBY_API_URL}/api/pages/${
              page.id
            }/export_xml?apiToken=${localStorage.getItem('apiToken')}`}
          />
          <Button
            label="Delete Page"
            buttonState="delete"
            onClick={() => setDeleteModalOpen(true)}
          />
          <Button
            label="Save Page As Blueprint"
            onClick={async () => {
              const { data } = await blueprintPage({ variables: { pageId: page.id } });
            }}
          />
        </Content>
      </Tabs>
      {deleteModalOpen && (
        <DeletePage page={page} setDeleteModalOpen={setDeleteModalOpen} />
      )}
      {importTranslationsOpen && (
        <ImportTranslations
          pageId={page.id}
          setImportTranslationsOpen={setImportTranslationsOpen}
        />
      )}
    </Wrapper>
  );
};

export default PageControlMenu;
