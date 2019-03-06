import React from 'react';
import OptionButtonGroup from './OptionButtonGroup';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import spotifyLogo from '../spotify_icon.png';
import Search from '../Search';
import ReleaseIcon from '@material-ui/icons/Album';
import ArtistIcon from '@material-ui/icons/Person';
import StyledItemWithThumbnail from '../StyledItemWithThumbnail';
import AudioAction from '../Cards/AudioAction';
import GoToIcon from '@material-ui/icons/OpenInBrowser';
import Tooltip from '@material-ui/core/Tooltip';
import StyledAction from '../Cards/StyledAction';

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

const CardTitle = styled.h3`
  padding: 0;
  padding-left: 8px;
`;

const actionComponents = {
  Audio: action => <AudioAction action={action} />,
  ExternalLink: ({ label, url }) => (
    <Tooltip title={label}>
      <StyledAction target="_blank" rel="noopener noreferrer" href={url}>
        <GoToIcon />
      </StyledAction>
    </Tooltip>
  ),
};

export default ({
  user: { isUsingSpotify },
  activeCard: { source, actions, actionsLoading },
  path: { cards, activeCardIndex },
  searchType,
  handleSearchTypeChange,
  showSplash,
  className,
}) => (
  <header className={className}>
    <OptionButtonGroup
      selectedValue={searchType}
      onChange={handleSearchTypeChange}
      values={searchTypes}
    />
    <SpotifyIndicator onClick={showSplash} isSpotifyLinked={isUsingSpotify}>
      <img className="logo" src={spotifyLogo} alt="Spotify" />
    </SpotifyIndicator>
    <Search />
    {!!cards.length && (
      <CardTitle>
        {source.name}{' '}
        {actions &&
          actions.map(({ type, ...action }) => (
            <span key={action.url}>{actionComponents[type](action)}</span>
          ))}
      </CardTitle>
    )}
  </header>
);
