import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core';

const StyledFab = withStyles({
  root: {
    boxShadow: 'none',
    marginRight: '10px',
  },
})(Fab);

export default StyledFab;
