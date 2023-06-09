import { TextField, withStyles } from '@material-ui/core';

const StyledTextField = withStyles({
  root: {
    width: '100%',
    marginBottom: '5%',
  },
})(TextField);

export default StyledTextField;
