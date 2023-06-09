import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';

const dialogStyles = () => ({
  paper: {
    width: '60vw',
    height: '50vh',
  },
});
const StyledDialog = withStyles(dialogStyles)(Dialog);

export default StyledDialog;
