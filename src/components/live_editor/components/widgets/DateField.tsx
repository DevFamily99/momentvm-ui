import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { isValid } from 'date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const DateInput = ({ value, required, onChange }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        value={isValid(value) ? value : null}
        required={required}
        onChange={(value) => onChange(value)}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateInput;
