import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';

/**
 * A styled material-ui `Tooltip`
 *
 * Use `title` Prop to indicate information
 */
const StyledTooltip = withStyles({
  tooltip: {
    fontSize: '12px',
  },
})(Tooltip);

export default StyledTooltip;
