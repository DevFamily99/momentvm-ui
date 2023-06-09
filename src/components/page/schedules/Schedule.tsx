import React from 'react';
import styled from 'styled-components';
import ScheduleForm from './ScheduleForm';
import StyledTooltip from '../../styled/StyledTooltip';
import SchedulePlaceholderPath from '../../../images/page-loading.svg';

const ScheduleWrapper = styled.div`
  display: flex;
  margin-left: 0;
  margin-top: 0;
  max-width: 97%;
  width: 32rem;
  margin-bottom: 20px;
  background: #f2f2f2;
  padding: 15px;
  flex-wrap: wrap;
  border-radius: 20px;
  @media (prefers-color-scheme: dark) {
    background: #b6b6b6;
  }
  & > .schedule-controls {
    flex: auto;
  }
  & > .schedule-iamge {
    flex: 0 0 100px;
  }
  img {
    max-height: 400px;
  }
`;

const ImageWrapper = styled.div`
  cursor: pointer;
  overflow: hidden;
`;

const Schedule: React.FC = ({ page, schedule, refetch }) => (
  <ScheduleWrapper>
    <div className="schedule-controls">
      <ScheduleForm page={page} schedule={schedule} refetch={refetch} />
    </div>
    <div className="schedule-image">
      <a
        style={{ display: 'contents' }}
        href={`/pages/${page.id}/${schedule.id}/en-GB/view-only-schedule-preview`}
      >
        <StyledTooltip title={`Schedule ID: ${schedule.id}`}>
          <span>
            <ImageWrapper>
              {schedule.imageUrl ? (
                <img alt="preview" src={schedule.imageUrl} />
              ) : (
                <SchedulePlaceholderPath width="30" />
              )}
            </ImageWrapper>
          </span>
        </StyledTooltip>
      </a>
    </div>
  </ScheduleWrapper>
);

export default Schedule;
