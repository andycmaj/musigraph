import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import spotifyLogo from '../spotify_logo.png';

const SpotifyLogo = styled.div`
  display: flex;

  .logo {
    margin: 20px 0;
    height: 3em;
  }
`;

const Splash = ({
  fullScreen,
  connectSpotify,
  dismissSplash,
  user: { isUsingSpotify, shouldShowSplash },
}) => (
  <div>
    <Dialog
      open={!isUsingSpotify && shouldShowSplash}
      fullScreen={fullScreen}
      onClose={() => {}}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Welcome to MusiGraph!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you have a Spotify Premium account, you can connect it to enable
          song samples. Do you want to connect MusiGraph to your Spotify Premium
          account?
        </DialogContentText>
        <SpotifyLogo>
          <img className="logo" src={spotifyLogo} alt="Spotify" />
        </SpotifyLogo>
      </DialogContent>
      <DialogActions>
        <Button onClick={connectSpotify} color="primary" autoFocus>
          Yes
        </Button>
        <Button onClick={dismissSplash} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default withMobileDialog()(Splash);
