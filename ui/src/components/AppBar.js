import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
};

const AppBar = ({ classes }) => (
  <MuiAppBar className={classes.root}>
    <Toolbar>
      <Typography className={classes.flex} variant="headline">
        {'Current page goes here'}
      </Typography>
    </Toolbar>
  </MuiAppBar>
);

AppBar.displayName = 'AppBar';

export default withStyles(styles, { name: 'AppBar' })(AppBar);
