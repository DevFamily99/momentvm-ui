import React, { useState, FC } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useSubscription, gql } from '@apollo/client';
import { DialogTitle, DialogContent, Dialog, DialogActions } from '@material-ui/core';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../../MVMButton';
import Tooltip from '../../styled/StyledTooltip';
import { PUBLISHING_TARGETS, PUBLISH_SCHEDULE } from '../../../utils/queries';
import { Schedule } from './types';
import CircularProgressLoad from '../../CircularProgresLoad';
import checkPermission from '../../../utils/permission';
import PublishingLogs from '../PublishingLogs';

const PublishedText = styled.p`
  color: grey;
  margin-left: 20px;
  margin-top: 5px;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export const SCHEDULE_PUBLISHING_STATUS = gql`
  subscription SchedulePublishingStatus($scheduleId: ID!) {
    schedulePublishingStatus(scheduleId: $scheduleId) {
      parts
      progress
      createdAt
      status
      publishingEvents {
        displayName
        category
        message
        status
      }
    }
  }
`;

interface Props {
  schedule: Schedule | null;
  pageContext: any;
}

const PublishButton: FC<Props> = ({ schedule, pageContext }) => {
  const [progress, setProgress] = useState(1);
  const [publishingStatus, setPublishingStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingColor, setLoadingColor] = useState('#666666');
  const [publishingTargets, setPublishingTargets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishingLogsDialog, setPublishingLogsDialog] = useState(false);

  const [publishSchedule] = useMutation(PUBLISH_SCHEDULE);
  useQuery(PUBLISHING_TARGETS, {
    onCompleted: (data) => setPublishingTargets(data.publishingTargets),
  });
  const { error } = useSubscription(SCHEDULE_PUBLISHING_STATUS, {
    variables: { scheduleId: schedule.id },
    onSubscriptionData: (res) => {
      if (res && res.subscriptionData.data.schedulePublishingStatus) {
        const { progress, status } = res.subscriptionData.data.schedulePublishingStatus;
        setProgress(progress);
        if (progress === 1 || status === 'failed') setLoadingStatus(false);
        setLoadingColor('#33ff4e');
        if (status === 'failed') {
          setLoadingColor('#ff2424');
          setProgress(1);
        }
        setPublishingStatus(res.subscriptionData.data.schedulePublishingStatus);
      }
    },
  });
  // console.log(error);

  let disabledMsg;
  if (!checkPermission('can_publish_pages')) {
    disabledMsg = "You don't have permission to publish pages.";
  }
  if (!schedule.countryGroups.length) {
    disabledMsg = 'You need to add a country group to the schedule.';
  }
  if (!pageContext) {
    disabledMsg = 'You need to set a page context before you can publish the page.';
  }

  if (disabledMsg) {
    return (
      <div>
        <Tooltip title={disabledMsg}>
          <span>
            <Button label="Publish" buttonState="disabled" trailingIcon="triangle" />
          </span>
        </Tooltip>
      </div>
    );
  }
  return (
    <div>
      {publishingLogsDialog && (
        <PublishingLogs
          scheduleId={schedule.id}
          setPublishingLogsDialog={setPublishingLogsDialog}
        />
      )}
      <Button
        onClick={() => {
          if (!loadingStatus) {
            setDialogOpen(true);
          } else {
            toast.info(
              'The page is currently being published, please wait a few minutes.',
            );
          }
        }}
        label={
          <div style={{ display: 'inline-flex' }}>
            <CircularProgressLoad progress={progress} color={loadingColor} />
            <p style={{ margin: '12px', marginTop: '18px' }}>
              {loadingStatus ? 'Publishing...' : 'Publish'}
            </p>
          </div>
        }
        buttonState="highlight"
        trailingIcon="triangle"
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Publish this page to...</DialogTitle>
        <DialogContent>
          {publishingTargets.map((pt) => (
            <div key={pt.id} style={{ margin: '13px' }}>
              <Button
                label={pt.name}
                onClick={() => {
                  setPublishingStatus(null);
                  setLoadingStatus(true);
                  setLoadingColor('#33ff4e');
                  publishSchedule({
                    variables: { id: schedule.id, publishingTargetId: pt.id },
                  });
                  setDialogOpen(false);
                  setProgress(0);
                }}
              />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            label="Close"
            buttonState="highlight"
          />
        </DialogActions>
      </Dialog>

      {publishingStatus && (
        <PublishedText onClick={() => setPublishingLogsDialog(true)}>
          Published {format(new Date(publishingStatus.createdAt), "yy-MM-dd 'at' h:mm a")}
          {' >'}
        </PublishedText>
      )}
    </div>
  );
};

export default PublishButton;
