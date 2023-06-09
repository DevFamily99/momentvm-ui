import React, { Fragment, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import { format } from 'date-fns';
import { navigate } from 'gatsby';
import { gql, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import Button from '../MVMButton';
import CircularProgressLoad from '../CircularProgresLoad';
import Pagination from '@material-ui/lab/Pagination';
import usePagination from '../../utils/Pagination';
import { Box } from '@material-ui/core';

export const PUBLISHING_MANIFESTS = gql`
  query PublishingManifests($scheduleId: ID, $pageId: ID) {
    publishingManifests(scheduleId: $scheduleId, pageId: $pageId) {
      id
      updatedAt
      createdAt
      localeCodes
      status
      progress
      manifestPublishing {
        category
        message
        status
      }
      modulePublishing {
        category
        message
        status
      }
      contentSlotsPublishing {
        category
        message
        status
      }
      assetUpload {
        category
        message
        status
      }
      publishingTarget {
        name
      }
      user {
        email
      }
      publishingEvents {
        category
        message
        status
      }
    }
  }
`;

const LocalesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 265px;
  margin: auto;
`;

const Locale = styled.div`
  border-radius: 20px;
  padding: 0.5rem 0.7rem;
  margin: 5px;
  display: inline-flex;
  justify-content: center;
  font-weight: 600;
  color: #2c2a3b;
  background: #dfdfdf;
  white-space: nowrap;
  font-weight: normal;
`;

const Error = styled.div`
  margin-left: 100px;
  border-radius: 20px;
  padding: 0.4rem 0.7rem;
  margin: 5px;
  display: inline-flex;
  justify-content: center;
  font-weight: 600;
  color: #641b1b;
  background: #ffd8d8;
  white-space: nowrap;
`;

const ErrorsWrapper = styled.div`
  margin-left: 40px;
  display: flex;
  width: 250px;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const ShowMore = styled(Locale)`
  cursor: pointer;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 600px;
  text-align: center;
  table-layout: fixed;
  font-weight: bold;
  th:nth-child(1) {
    width: 5%;
  }
  th:nth-child(3) {
    width: 200px;
  }
  th:nth-child(5),
  th:nth-child(6),
  th:nth-child(7) {
    width: 10%;
  }
  td,
  svg,
  span {
    vertical-align: middle;
  }
`;

const Locales = ({ locales }) => {
  const [showCount, setShowCount] = useState(2);
  return (
    <LocalesWrapper>
      {locales.slice(0, showCount).map((locale) => (
        <Locale key={locale}>{locale}</Locale>
      ))}
      {locales.length > 2 && showCount === 2 && (
        <ShowMore onClick={() => setShowCount(100)}>...</ShowMore>
      )}
    </LocalesWrapper>
  );
};

const Errors = ({ manifest }) => {
  const failedEvents = manifest.publishingEvents.filter((pe) => pe.status === 'failed');
  const errors = new Set();
  failedEvents.forEach((event) => {
    const keys = Object.keys(event.message);
    keys.forEach((key) => {
      if (event.message[key].error) {
        if (event.category === 'publish_modules') {
          if (event.message[key].template) {
            errors.add(`${event.message[key].template} - ${event.message[key].error}`);
          } else {
            errors.add(`${key} - ${event.message[key].error}`);
          }
        } else {
          errors.add(`${key} - ${event.message[key].error}`);
        }
      }
    });
  });
  if (errors.size === 0) return <></>;
  return (
    <ErrorsWrapper>
      {Array.from(errors).map((error) => (
        <Error key={uuidv4()}>{error}</Error>
      ))}
    </ErrorsWrapper>
  );
};

interface Props {
  scheduleId?: string;
  pageId?: string;
  setPublishingLogsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Publishing logs show the previous publishing manifests for a schedule / page
 *
 */
const PublishingLogs = ({
  scheduleId = null,
  pageId = null,
  setPublishingLogsDialog,
}: Props) => {
  const { data, loading, error } = useQuery(PUBLISHING_MANIFESTS, {
    fetchPolicy: 'network-only',
    pollInterval: 15000,
    variables: { scheduleId, pageId },
    onCompleted: (data) => setPublishingLogs(data.publishingManifests)
  });
  
  const [publishinglogs,setPublishingLogs] = useState([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const count = Math.ceil(publishinglogs.length / PER_PAGE);
  
  const publishingData = usePagination(publishinglogs, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    publishingData.jump(p);
  };

  const getColorForStatus = (status) => {
    if (status === 'completed') return '#0dff00';
    if (status === 'failed') return '#ff0000';
    if (!status) return '#666666';
    return '#ffe100';
  };
  if (loading) return <></>;
  if (error) return <>Error</>;

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open onClose={() => setPublishingLogsDialog(false)}>
        <DialogTitle id="alert-dialog-title">Publishing Logs</DialogTitle>
        <DialogContent>
          <StyledTable>
            <thead>
              <tr>
                <th />
                <th>Published At:</th>
                <th>Target</th>
                <th>Locales</th>
                <th />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              { publishingData.currentData().map((manifest) => (
                <Fragment key={manifest.id}>
                  <tr>
                    <td>
                      <CircularProgressLoad
                        progress={1}
                        color={getColorForStatus(manifest.status)}
                        circleFill="white"
                        radius={12}
                      />
                    </td>
                    <td>
                      {format(new Date(manifest.createdAt), "yy-MM-dd 'at' h:mm a")}
                    </td>
                    <td>
                      <Button
                        trailingIcon="triangle"
                        onClick={() => navigate('/settings/publishing-targets')}
                        label={manifest.publishingTarget.name}
                      />
                    </td>
                    <td>
                      <Locales locales={manifest.localeCodes} />
                    </td>
                    <td>
                      <CircularProgressLoad
                        progress={1}
                        color={getColorForStatus(manifest.modulePublishing?.status)}
                        circleFill="white"
                        radius={12}
                      />{' '}
                      <span>Assets</span>
                    </td>
                    <td>
                      {scheduleId && (
                        <>
                          <CircularProgressLoad
                            progress={1}
                            color={getColorForStatus(
                              manifest.contentSlotsPublishing?.status,
                            )}
                            circleFill="white"
                            radius={12}
                          />{' '}
                          Slots
                        </>
                      )}
                      {pageId && (
                        <>
                          <CircularProgressLoad
                            progress={1}
                            color={getColorForStatus(manifest.manifestPublishing?.status)}
                            circleFill="white"
                            radius={12}
                          />{' '}
                          Manifest
                        </>
                      )}
                    </td>
                    <td>
                      <CircularProgressLoad
                        progress={1}
                        color={getColorForStatus(manifest.assetUpload?.status)}
                        circleFill="white"
                        radius={12}
                      />{' '}
                      Images
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Errors manifest={manifest} />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>   
          </StyledTable>
        </DialogContent>
        <br />
        <Box display="flex" justifyContent="center">
            <Pagination count={count}  page={page}  onChange={handleChange} />
        </Box>
        <DialogActions>
          <Button label="Close" onClick={() => setPublishingLogsDialog(false)} />
        </DialogActions>
      </Dialog>
    </>
  );
};

PublishingLogs.defaultProps = {
  pageId: null,
  scheduleId: null,
};

export default PublishingLogs;
