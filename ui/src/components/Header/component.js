import React from 'react';
import OptionButtonGroup from '../OptionButtonGroup';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import spotifyLogo from '../spotify_icon.png';

const searchTypes = ['artist', 'release'];

const SpotifyIndicator = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;

  .logo {
    filter: ${props => (props.isSpotifyLinked ? 'none' : 'grayscale(100%)')};
    height: 20px;
    width: 20px;
  }
`;

const Header = ({
  user: { isUsingSpotify },
  searchType,
  handleSearchTypeChange,
  showSplash
}) => (
  <section>
    <OptionButtonGroup
      selectedValue={searchType}
      onChange={handleSearchTypeChange}
      values={searchTypes}
    />
    <SpotifyIndicator onClick={showSplash} isSpotifyLinked={isUsingSpotify}>
      <img className="logo" src={spotifyLogo} alt="Spotify" />
    </SpotifyIndicator>
  </section>
);

export default Header;
