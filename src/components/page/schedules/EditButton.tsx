import React, { FC } from 'react';
import Button from '../../MVMButton';
import Tooltip from '../../styled/StyledTooltip';
import { Schedule } from './types';

interface EditButtonProps {
  schedule: Schedule;
}

const EditButton: FC<EditButtonProps> = ({ schedule }) => {
  if (!schedule.countryGroups.length) {
    return (
      <Tooltip title="You need to add a country group to the schedule">
        <span>
          <Button label="Preview" trailingIcon="triangle" buttonState="disabled" />
        </span>
      </Tooltip>
    );
  }

  return (
    <Button
      label={<div style={{ margin: '19px' }}>Preview</div>}
      trailingIcon="triangle"
      target={`/pages/${schedule.pageId}/schedule/${schedule.id}`}
    />
  );
};

export default EditButton;
