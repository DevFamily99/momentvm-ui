import React from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import PageAttributeEditor from './attributes/PageAttributeEditor';
import PageControlMenu from './ClassicPageControlMenu';
import { GET_PAGE_FOLDERS } from '../../utils/queries';
import arrow from '../../../images/arrow.svg';

/*  Will fetch a given page and all country groups  */
export const GET_PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      name
      title
      description
      keywords
      url
      allLocales
      allowedCountries
      schedules {
        id
        startAt
        endAt
        published
        imageUrl
        pageId
        countryGroups {
          id
          name
          description
          sites {
            id
            name
            salesforceId
            locales {
              id
              code
              name
              displayName
            }
          }
        }
      }
    }
    countryGroups {
      id
      name
      description
    }
    publishingTargets {
      id
      name
    }
  }
`;

export interface PageQueryResponse {
  page: Page;
  countryGroups: CountryGroup[];
  publishingTargets: PublishingTarget[];
}

export interface PageFoldersQueryResponse {
  pageFolders: PageFolder[];
}

export interface PageFolder {
  id: string;
  name: string;
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
  title: null;
  description: null;
  keywords: null;
  url: null;
  allLocales: Locale[];
  allowedCountries: AllowedCountry[];
  schedules: Schedule[];
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

const Header = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 2%;
`;

const SubTitle = styled.h2`
  margin-top: 1.2% !important;
  margin-right: 2%;
  border-bottom: 1px solid;
`;

const PageFolderBreadcrumb = styled.div`
  display: flex;

  a {
    color: #000000;
  }
`;

const BreadcrumbDivider = styled.div`
  margin: 0 0.2rem;
  background: transparent url('${arrow}') no-repeat;
  width: 16px;
  height: 14px;
  background-position: 0 2px;
  display: inline-block;
`;

const Breadcrumbs = styled.div`
  display: flex;
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
  const { data, loading, error } = useQuery<PageQueryResponse, PageVars>(GET_PAGE, {
    variables: { id },
  });

  const { loading: loadingPageFolders, data: dataPageFolders } = useQuery<
    PageFoldersQueryResponse,
    PageVars
  >(GET_PAGE_FOLDERS, {
    variables: { id },
  });
  // console.log(data, loading, error);

  return (
    <div>
      {loading && 'Loading...'}
      {error && 'Error.'}
      {!loading && (
        <>
          {!loadingPageFolders && (
            <Breadcrumbs>
              {dataPageFolders.pageFolders.map((folder, index) => (
                <PageFolderBreadcrumb key={folder.id}>
                  <a href={`/page_folders/${folder.id}`}>{folder.name}</a>

                  {index < dataPageFolders.pageFolders.length - 1 && (
                    <BreadcrumbDivider> </BreadcrumbDivider>
                  )}
                </PageFolderBreadcrumb>
              ))}
            </Breadcrumbs>
          )}
          <PageControlMenu
            id={id}
            editingCountries={data.page.allowedCountries}
            publishingTargets={data.publishingTargets}
          />
          <div>
            <div>
              <SubTitle>Page Attributes</SubTitle>
              <br />
              <PageAttributeEditor page={data.page} theme={theme} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
