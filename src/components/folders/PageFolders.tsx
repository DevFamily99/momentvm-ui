import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Menu, MenuItem } from '@material-ui/core';
import { useLocation } from '@reach/router';
import NewFolder from './NewFolder';
import Folder from './Folder';
import { DraggablePage as Page } from './Page';
import BreadCrumbs from './BreadCrumbs';
import Sort from './Sort';
import PaginationControlls from './PaginationControlls';
import MVMButton from '../MVMButton';
import EditableName from './EditableName';
import checkPermission from '../../utils/permission';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-row-gap: 10px;
  max-width: 80vw;
  img {
    object-fit: contain;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`;

const CREATE_PAGE = gql`
  mutation CreatePage($pageFolderId: ID, $classic: Boolean) {
    createPage(input: { pageFolderId: $pageFolderId, classic: $classic }) {
      page {
        id
      }
    }
  }
`;

export const MOVE_TO_ARCHIVE = gql`
  mutation MoveToArchive($id: ID!, $type: String!) {
    moveToArchive(input: { id: $id, type: $type }) {
      message
    }
  }
`;
export const RESTORE_FROM_ARCHIVE = gql`
  mutation RestoreFromArchive($id: ID!, $type: String!) {
    restoreFromArchive(input: { id: $id, type: $type }) {
      message
    }
  }
`;

const GET_PAGE_FOLDER = gql`
  query GetPageFolder(
    $path: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: String!
    $direction: String!
  ) {
    pageFolder(path: $path) {
      id
      name
      slug
      root
      isArchive
      breadcrumbs
      pageFolders {
        id
        name
        path
      }
      pages(
        first: $first
        last: $last
        before: $before
        after: $after
        order: $order
        direction: $direction
      ) {
        totalCount
        totalPageCount
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        nodes {
          id
          name
          thumb
        }
      }
    }
  }
`;

const PageFolders = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>(null);
  const [perPageCount, setPerPageCount] = useState(50); // maybe make the show per make a selectable thing?
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({
    first: perPageCount,
  });
  const [sortBy, setSortBy] = useState({
    order: 'updated_at',
    direction: 'DESC',
  });
  const [menuOptions, setMenuOptions] = useState({
    mouseX: null,
    mouseY: null,
    id: null,
    type: null,
  });
  const location = useLocation();
  const { refetch } = useQuery(GET_PAGE_FOLDER, {
    variables: {
      path: location.pathname,
      ...sortBy,
      ...paginationOptions,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: Data) => {
      setCurrentFolder(data.pageFolder);
    },
  });
  const [createPage] = useMutation(CREATE_PAGE);
  const [moveToArchive] = useMutation(MOVE_TO_ARCHIVE, {
    onCompleted: (data) => toast.success(data.moveToArchive.message),
  });
  const [restoreFromArchive] = useMutation(RESTORE_FROM_ARCHIVE, {
    onCompleted: (data) => toast.success(data.restoreFromArchive.message),
  });
  useEffect(() => {
    refetch();
  }, [currentFolder]);

  const openContextMenu = (event: React.MouseEvent<HTMLDivElement>, id, type) => {
    event.preventDefault();
    setMenuOptions({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      id,
      type,
    });
  };

  const closeContextMenu = () => {
    setMenuOptions({
      mouseX: null,
      mouseY: null,
      id: null,
      type: null,
    });
  };

  const handleArchive = async () => {
    await moveToArchive({
      variables: { id: menuOptions.id, type: menuOptions.type },
    });
    closeContextMenu();
    refetch();
  };

  const handleRestore = async () => {
    await restoreFromArchive({
      variables: { id: menuOptions.id, type: menuOptions.type },
    });
    closeContextMenu();
    refetch();
  };

  if (!currentFolder) {
    return <p>loading...</p>;
  }
  return (
    <>
      <h1>{currentFolder.isArchive ? 'Archive' : 'Pages'}</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!currentFolder.root && (
          <BreadCrumbs breadcrumbs={currentFolder.breadcrumbs} refetch={refetch} dnd />
        )}
        <EditableName currentFolder={currentFolder} isArchive={currentFolder.isArchive} />
      </div>
      <br />
      {!currentFolder.isArchive && (
        <ControlsWrapper>
          {checkPermission('can_create_pages') && (
            <MVMButton
              label="New Page"
              buttonState="highlight"
              onClick={async () => {
                const { data } = await createPage({
                  variables: { pageFolderId: currentFolder.id, classic: false },
                });
                if (window) {
                  window.location = `/pages/${data.createPage.page.id}`;
                }
              }}
            />
          )}
          <NewFolder currentFolder={currentFolder} refetch={refetch} folderType="page" />
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
        </ControlsWrapper>
      )}
      <GridWrapper>
        {currentFolder.pageFolders.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            openContextMenu={(e) => openContextMenu(e, folder.id, 'folder')}
            refetch={refetch}
          />
        ))}
        {currentFolder.pages.nodes.map((page) => (
          <Page
            key={page.id}
            page={page}
            openContextMenu={(e) => openContextMenu(e, page.id, 'page')}
          />
        ))}
      </GridWrapper>
      <Menu
        keepMounted
        transitionDuration={0}
        open={menuOptions.mouseY !== null}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuOptions.mouseY !== null && menuOptions.mouseX !== null
            ? { top: menuOptions.mouseY, left: menuOptions.mouseX }
            : undefined
        }
      >
        {currentFolder.isArchive ? (
          <MenuItem onClick={handleRestore}>Restore</MenuItem>
        ) : (
          <MenuItem onClick={handleArchive}>Archive</MenuItem>
        )}
      </Menu>
      <PaginationControlls
        setPaginationOptions={setPaginationOptions}
        perPageCount={perPageCount}
        paginationOptions={currentFolder.pages.pageInfo}
      />
    </>
  );
};

export default PageFolders;
