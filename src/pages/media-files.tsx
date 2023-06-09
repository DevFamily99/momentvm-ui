import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_ASSET = gql`
  query getAsset($id: ID!) {
    asset(id: $id) {
      id
      name
      variants
      assetFolder {
        name
      }
    }
  }
`;

/**
 * Page to preview a single asset
 */
const MediaFiles = ({ location }) => {
  console.log(location);
  const { data, loading, error } = useQuery(GET_ASSET, {
    variables: { id: location.pathname.split('/').reverse()[0] },
  });
  if (loading) {
    return <>Loading...</>;
  }
  return (
    <div>
      <h1>{data.asset.name}</h1>
      <p>Folder: {data.asset.assetFolder.name}</p>
      {data.asset.variants.map((variant) => (
        <div key={variant.name}>
          <h3>{variant.name}</h3>
          <img src={variant.url} />
        </div>
      ))}
    </div>
  );
};
export default MediaFiles;
