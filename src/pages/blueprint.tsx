import React, { useState, useMemo } from 'react';
import { gql, useMutation, useQuery, ApolloConsumer } from '@apollo/client';
import { toast } from 'react-toastify';

import Button from '../components/MVMButton';
import DeleteBlueprint from '../components/DeleteBlueprint';

const GET_BLUEPRINTS = gql`
  query {
    blueprints {
      id
      name
    }
  }
`;

const DELETE_BLUEPRINT = gql`
  mutation deleteBlueprint($id: ID!) {
    deleteBlueprint(input: { id: $id }) {
      blueprint {
        id
      }
    }
  }
`;

const UPDATE_BLUEPRINT = gql`
  mutation updateBlueprint($id: ID!, $approveTeam: Boolean) {
    updateTeam(input: { id: $id, approveTeam: $approveTeam }) {
      team {
        id
        name
        approved
      }
    }
  }
`;

const CREATE_PAGE_FROM_BLUEPRINT = gql`
  mutation CreatePageFromBlueprint(
    $pageFolderId: ID
    $classic: Boolean
    $blueprintId: ID
  ) {
    createPageFromBlueprint(
      input: { pageFolderId: $pageFolderId, classic: $classic, blueprintId: $blueprintId }
    ) {
      page {
        id
      }
    }
  }
`;

const Blueprint = (props) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteBlueprintId, setDeleteBlueprintId] = useState(null);
  const [createPageFromBLueprint] = useMutation(CREATE_PAGE_FROM_BLUEPRINT);

  const {
    data: blueprintsData,
    loading: blueprintsLoading,
    error,
  } = useQuery(GET_BLUEPRINTS);

  const [deleteBlueprint] = useMutation(DELETE_BLUEPRINT, {
    refetchQueries: [
      {
        query: GET_BLUEPRINTS,
      },
    ],
  });

  if (blueprintsLoading) {
    return 'Loading blueprints...';
  }

  return (
    <>
      {deleteModalOpen && (
        <DeleteBlueprint
          setDeleteModalOpen={setDeleteModalOpen}
          deleteBlueprint={deleteBlueprint}
          blueprintId={deleteBlueprintId}
        />
      )}

      <h1>Blueprints</h1>
      {blueprintsData.blueprints.length == 0 ? (
        <p>No blueprints available</p>
      ) : (
        <div className="teams-list">
          <table>
            <thead>
              <tr>
                <th>Blueprint</th>
                <th colSpan="3" />
              </tr>
            </thead>

            <tbody>
              {blueprintsData.blueprints.map((blueprint) => (
                <tr key={blueprint.id}>
                  <td>{blueprint.name}</td>
                  <td />

                  <td>
                    <Button
                      label="Delete"
                      buttonState="delete"
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setDeleteBlueprintId(blueprint.id);
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      label="Create Page from Blueprint"
                      onClick={async () => {
                        const { data } = await createPageFromBLueprint({
                          variables: { classic: false, blueprintId: blueprint.id },
                        });
                        if (window) {
                          window.location = `/page_folders`;
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Blueprint;
