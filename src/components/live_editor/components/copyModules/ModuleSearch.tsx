import React, { useState } from 'react';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { Template } from '../Module';

const ModuleSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModuleSearchResultContainer = styled.div`
  height: 65vh;
  display: flex;
  flex-wrap: wrap;
  overflow: scroll;
  align-content: flex-start;
`;

const NoModulesFound = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  color: #979797;
`;

export const GET_PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      name
      pageModules {
        id
        template {
          id
          name
          description
          imageUrl
        }
      }
    }
  }
`;

const ModuleSearch = ({ page }) => {
  const [modules, setModules] = useState([]);

  const { loading } = useQuery(GET_PAGE, {
    variables: { id: page.id },
    onCompleted: (data) => setModules(data.page.pageModules),
  });

  return (
    <ModuleSearchContainer>
      <h3>{page.name}</h3>

      <ModuleSearchResultContainer>
        {loading ? (
          'Loading...'
        ) : (
          <>
            {!modules.length ? (
              <NoModulesFound>This page does not have any modules.</NoModulesFound>
            ) : (
              modules.map((mod) => (
                <Template
                  key={mod.id}
                  pageModuleId={mod.id}
                  name={mod.template.name}
                  imageUrl={mod.template.imageUrl}
                />
              ))
            )}
          </>
        )}
      </ModuleSearchResultContainer>
    </ModuleSearchContainer>
  );
};

export default ModuleSearch;
