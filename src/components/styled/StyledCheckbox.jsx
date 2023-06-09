import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

const checkBoxStyles = () => ({
  root: {
    '&$checked': {
      color: '#ff7e00',
    },
  },
  checked: {},
});
const StyledCheckbox = withStyles(checkBoxStyles)(Checkbox);

export default StyledCheckbox;
