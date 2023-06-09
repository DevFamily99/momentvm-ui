import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Menu, MenuItem } from '@material-ui/core';
import { useLocation } from '@reach/router';
import { toast } from 'react-toastify';
import AssetUpload from './AssetUpload';
import NewFolder from './NewFolder';
import Folder from './Folder';
import Asset from './Asset';
import { Data, FolderType, PaginationOptions } from './types';
import Breadcrumbs from './BreadCrumbs';
import PaginationControlls from './PaginationControlls';
import EditableName from './EditableName';
import Sort from './Sort';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-row-gap: 10px;
  max-width: 80vw;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`;

export const GET_ASSET_FOLDER = gql`
  query GetAssetFolder(
    $path: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: String!
    $direction: String!
  ) {
    assetFolder(path: $path) {
      id
      name
      slug
      root
      breadcrumbs
      assetFolders {
        id
        name
        slug
        path
      }
      assets(
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
          thumbnail
        }
      }
    }
  }
`;

const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(input: { id: $id }) {
      message
    }
  }
`;

const DELETE_ASSET_FOLDER = gql`
  mutation DeleteAssetFolder($id: ID!) {
    deleteAssetFolder(input: { id: $id }) {
      message
    }
  }
`;

const AssetFolder = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>(null);
  const [perPageCount, setPerPageCount] = useState(50); // maybe make the show per make a selectable thing?
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({
    first: perPageCount,
  });
  const [sortBy, setSortBy] = useState({ order: 'updated_at', direction: 'DESC' });
  const [menuOptions, setMenuOptions] = useState({
    mouseX: null,
    mouseY: null,
    id: null,
    type: null,
  });
  const location = useLocation();
  const { refetch } = useQuery(GET_ASSET_FOLDER, {
    ssr: false,
    variables: {
      path: location.pathname,
      ...sortBy,
      ...paginationOptions,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: Data) => setCurrentFolder(data.assetFolder),
  });
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: (data) => toast.success(data.deleteAsset.message),
  });
  const [deleteAssetFolder] = useMutation(DELETE_ASSET_FOLDER, {
    onCompleted: (data) => toast.success(data.deleteAssetFolder.message),
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

  const deleteSelectedAsset = () => {
    deleteAsset({ variables: { id: menuOptions.id } });
    closeContextMenu();
    refetch();
  };

  const deleteSelectedAssetFolder = () => {
    if (confirm('Delete folder and its contents')) {
      deleteAssetFolder({ variables: { id: menuOptions.id } }).then(() => {
        refetch();
      });
    }
    closeContextMenu();
  };

  if (!currentFolder) {
    return <p>loading...</p>;
  }

  return (
    <>
      <h1>Images</h1>
      <EditableName currentFolder={currentFolder} isArchive={false} />
      {!currentFolder.root && (
        <Breadcrumbs breadcrumbs={currentFolder.breadcrumbs} refetch={refetch} dnd />
      )}
      <br />
      <ControlsWrapper>
        <NewFolder currentFolder={currentFolder} refetch={refetch} folderType="asset" />
        <AssetUpload currentFolder={currentFolder} refetch={refetch} />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
      </ControlsWrapper>
      <GridWrapper>
        {currentFolder.assetFolders.map((folder) => (
          <Folder
            key={folder.id}
            folder={folder}
            openContextMenu={(e) => openContextMenu(e, folder.id, 'folder')}
            refetch={refetch}
          />
        ))}
        {currentFolder.assets.nodes.map((asset) => (
          <Asset
            key={asset.id}
            asset={asset}
            openContextMenu={(e) => openContextMenu(e, asset.id, 'asset')}
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
        {/* <MenuItem onClick={closeContextMenu}>Edit</MenuItem> */}
        {menuOptions.type === 'asset' && (
          <MenuItem onClick={() => deleteSelectedAsset()}>Delete</MenuItem>
        )}
        {menuOptions.type === 'folder' && (
          <MenuItem onClick={() => deleteSelectedAssetFolder()}>Delete</MenuItem>
        )}
      </Menu>
      <PaginationControlls
        setPaginationOptions={setPaginationOptions}
        perPageCount={perPageCount}
        paginationOptions={currentFolder.assets.pageInfo}
      />
    </>
  );
};

export default AssetFolder;
