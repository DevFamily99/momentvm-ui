export interface Data {
  assetFolder: FolderType;
}

export interface FolderType {
  id: string;
  name: string;
  slug: string;
  root: boolean;
  isArchive: boolean;
  breadcrumbs: Breadcrumb[];
  assetFolders: FolderElement[];
  pageFolders: FolderElement[];
  assets: PaginatedContent;
  pages: PaginatedContent;
}

export interface FolderElement {
  id: string;
  name: string;
  slug: string;
  __typename: string;
}

export interface PaginatedContent {
  totalCount: number;
  totalPageCount: number;
  pageInfo: PageInfo;
  nodes: FolderContent[];
}

export interface FolderContent {
  id: string;
  name: string;
  thumb: string;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface PaginationOptions {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
}
