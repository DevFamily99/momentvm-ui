import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@material-ui/core';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { navigate } from 'gatsby';
import MVMButton from '../MVMButton';

const GET_TRANSLATION_PROJECTS = gql`
  {
    translationProjects {
      id
      submissionId
      title
      dueDate
      createdAt
    }
  }
`;

const GET_TRANSLATION_PROJECT = gql`
  query GetTranslationProject($submissionId: ID!, $provider: TranslationProvider!) {
    translationProject(submissionId: $submissionId, provider: $provider)
  }
`;

const FETCH_TRANSLATION_ASSIGNMENT = gql`
  mutation FetchTranslationAssignment($projectId: ID!) {
    fetchTranslationAssignment(input: { projectId: $projectId }) {
      message
    }
  }
`;

interface TranslationProject {
  id: string;
  title: string;
  submissionId: BigInteger;
  dueDate: string;
  createdAt: string;
}

interface ProjectProps {
  project: TranslationProject;
  setProjectId: Function;
}

const HeadingWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
`;

const ListWrapper = styled.div`
  margin-top: 3vh;
`;

const ProjectWrapper = styled.div`
  height: 100px;
  width: 90%;
  -webkit-box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 12px 0px rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 15px;
  border-radius: 8px;
`;

const DetailsWrapper = styled.div`
  width: 500px;
`;

const JobWrapper = styled.div`
  -webkit-box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 7px 0px rgba(0, 0, 0, 0.75);
  margin: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const handleFetchTranslations = async (fetchTranslationAssignment, projectId) => {
  const { data } = await fetchTranslationAssignment({
    variables: { projectId },
  });
  toast.success(data.fetchTranslationAssignment.message);
};

const Project = ({ project, setProjectId }: ProjectProps) => {
  return (
    <ProjectWrapper>
      <h2
        style={{
          width: '40%',
        }}
      >
        {project.title.length > 15 ? project.title.substring(0, 15) + '...' : project.title }
      </h2>
      <div style={{ width: '40%' }}>
        <div>Submission ID: {project.submissionId}</div>
        <div>Due Date: {format(new Date(project.dueDate), "yy-MM-dd 'at' h:mm a")}</div>
        <div>
          Created At: {format(new Date(project.createdAt), "yy-MM-dd 'at' h:mm a")}
        </div>
      </div>
      <MVMButton
        style={{ width: '10%' }}
        label="View Project status"
        onClick={() => setProjectId(project.id)}
      />
    </ProjectWrapper>
  );
};

const LanguageAssignment = ({
  assignment: { target_language, status, distant_key },
  fetchTranslationAssignment,
  submissionId,
}) => {
  return (
    <JobWrapper>
      <div>
        <p>Target Language: {target_language}</p>
        <p>
          <strong>Status: {status}</strong>
        </p>
      </div>
      <MVMButton
        label="Import"
        buttonDownLabel="Importing..."
        buttonState={status === 1 ? 'default' : 'disabled'}
        onClick={() =>
          handleFetchTranslations(fetchTranslationAssignment, [distant_key], submissionId)
        }
      />
    </JobWrapper>
  );
};

const ProjectDetails = ({ project, setProjectId }) => {
  const [submission, setSubmission] = useState(null);
  useQuery(GET_TRANSLATION_PROJECT, {
    variables: { submissionId: project.submissionId, provider: 'LW' },
    skip: project.submissionId === null,
    onCompleted: (data) => setSubmission(data?.translationProject),
  });
  const [fetchTranslationAssignment] = useMutation(FETCH_TRANSLATION_ASSIGNMENT);
  return (
    <Dialog open onClose={() => setProjectId(null)}>
      <DialogTitle>{project.title}</DialogTitle>

      <DialogContent>
        <DetailsWrapper>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!project.submissionId && (
              <p>
                The translations of this project are being validated. If this message is
                still visible 10 minutes after you have created the project check if the
                sent translations are valid.
              </p>
            )}
            {submission && (
              <>
                <p>
                  <strong>Project Status: {submission.status}</strong>
                </p>
                <MVMButton
                  label="Import Translations"
                  buttonState={submission.status === 'READY' ? 'highlight' : 'disabled'}
                  buttonDownLabel="Importing..."
                  onClick={() => {
                    handleFetchTranslations(
                      fetchTranslationAssignment,
                      project.submissionId,
                    );
                  }}
                />
              </>
            )}
          </div>
          <p>Project Assignments:</p>
          {data.translationProject.assignments.map((assignment) => (
            <LanguageAssignment
              key={assignment.distant_key}
              assignment={assignment}
              fetchTranslationAssignment={fetchTranslationAssignment}
              submissionId={submissionId}
            />
          ))}
        </DetailsWrapper>
      </DialogContent>
      <DialogActions>
        <MVMButton
          label="Close"
          buttonState="highlight"
          onClick={() => setProjectId(null)}
        />
      </DialogActions>
    </Dialog>
  );
};

const ProjectList = () => {
  const [projectId, setProjectId] = useState(null);
  const { data, loading, error } = useQuery(GET_TRANSLATION_PROJECTS, {
    fetchPolicy: 'network-only',
  });

  return (
    <div>
      <HeadingWrapper>
        <h1>Project List</h1>
        <MVMButton
          onClick={() => navigate('/translation-projects/new')}
          label="Create a new Project"
          buttonState="highlight"
        />
      </HeadingWrapper>
      {projectId && (
        <ProjectDetails
          project={data.translationProjects.filter((p) => p.id === projectId)[0]}
          setProjectId={setProjectId}
        />
      )}
      {!loading && !error && (
        <ListWrapper>
          {data.translationProjects.map((project) => (
            <Project
              key={project.submissionId}
              project={project}
              setProjectId={setProjectId}
            />
          ))}
        </ListWrapper>
      )}
    </div>
  );
};

export default ProjectList;
