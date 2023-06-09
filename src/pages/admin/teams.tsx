import React, { useState, useMemo } from 'react';
import { gql, useMutation, useQuery, ApolloConsumer } from '@apollo/client';
import { toast } from 'react-toastify';
import Button from '../../components/MVMButton';
import DeleteTeam from '../../components/DeleteTeam';

const GET_TEAMS = gql`
  query {
    teams {
      id
      name
      approved
      slug
    }
  }
`;
const GET_CURRENT_TEAM = gql`
  query {
    currentTeam {
      id
      name
      approved
    }
  }
`;
const SET_TEAM = gql`
  mutation setTeam($id: String!) {
    setTeam(input: { id: $id }) {
      team {
        id
        name
      }
      token
    }
  }
`;
const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(input: { id: $id }) {
      team {
        id
      }
    }
  }
`;
const UPDATE_TEAM = gql`
  mutation updateTeam($id: ID!, $approveTeam: Boolean) {
    updateTeam(input: { id: $id, approveTeam: $approveTeam }) {
      team {
        id
        name
        approved
      }
    }
  }
`;

const TeamList = (props) => {
  // console.log(props);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState(null);

  const { data: currentTeamData, loading: currentTeamLoading } =
    useQuery(GET_CURRENT_TEAM);
  const { data: teamsData, loading: teamsLoading } = useQuery(GET_TEAMS);
  const [updateTeam] = useMutation(UPDATE_TEAM, {
    refetchQueries: [
      {
        query: GET_TEAMS,
      },
    ],
  });
  const [setTeam] = useMutation(SET_TEAM, {
    refetchQueries: [
      {
        query: GET_CURRENT_TEAM,
      },
    ],
  });
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries: [
      {
        query: GET_TEAMS,
      },
    ],
  });

  useMemo(() => {
    if (!currentTeamLoading) {
      setCurrentTeam(currentTeamData.currentTeam);
    }
  }, [currentTeamData]);

  if (currentTeamLoading || !currentTeam) {
    return 'Loading current team';
  }
  if (teamsLoading) {
    return 'Loading teams...';
  }

  return (
    <>
      {deleteModalOpen && (
        <DeleteTeam
          setDeleteModalOpen={setDeleteModalOpen}
          deleteTeam={deleteTeam}
          teamId={deleteTeamId}
        />
      )}

      <h1>Teams</h1>

      <div className="team-selection">
        <p>Current team: {currentTeamData.currentTeam.name} </p>
      </div>

      <div className="teams-list">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th colSpan="3" />
            </tr>
          </thead>
          <tbody>
            {teamsData.teams.map((team) => (
              <tr key={team.id}>
                <td data-team-id={team.id}>{team.name}</td>
                <td>
                  <Button
                    label="Edit"
                    trailingIcon="triangle"
                    onClick={() => {
                      window.location = `teams/${team.slug}/edit`;
                    }}
                  />
                </td>
                <td>
                  {team.approved ? (
                    <Button label="Approved" buttonState="disabled" />
                  ) : (
                    <Button
                      label="Approve"
                      buttonDownLabel="Loading..."
                      onClick={async () => {
                        await updateTeam({
                          variables: { id: team.id, approveTeam: true },
                        })
                          .then(() => toast.success('Team approved.'))
                          .catch((errors) => toast.error(String(errors)));
                      }}
                    />
                  )}
                </td>
                {team.id !== currentTeam.id ? (
                  <>
                    <td>
                      <Button
                        label="Delete"
                        buttonState="delete"
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setDeleteTeamId(team.id);
                        }}
                      />
                    </td>
                    <td>
                      <ApolloConsumer>
                        {(client) => (
                          <Button
                            label="Set Team"
                            onClick={async () => {
                              const { data } = await setTeam({
                                variables: { id: team.id },
                              });
                              localStorage.setItem('apiToken', data.setTeam.token);
                              document.getElementById('sidebar_team_name').innerText =
                                data.setTeam.team.name;
                              toast.success('Your team was changed successfully.');
                              await client.resetStore();
                            }}
                          />
                        )}
                      </ApolloConsumer>
                    </td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamList;
