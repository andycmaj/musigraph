import React from 'react';
import OptionButtonGroup from './OptionButtonGroup';
import styled from 'styled-components';
import spotifyLogo from '../spotify_icon.png';
import Search from '../Search';
import AudioAction from '../Cards/AudioAction';
import GoToIcon from '@material-ui/icons/OpenInBrowser';
import Tooltip from '@material-ui/core/Tooltip';
import StyledAction from '../Cards/StyledAction';
import SpotifyIndicator from './SpotifyIndicator';

const searchTypes = ['artist', 'release'];

const CardTitle = styled.h3`
  padding: 0;
  padding-left: 8px;
`;

const actionComponents = {
  audio: action => <AudioAction action={action} />,
  externalLink: ({ label, url }) => (
    <Tooltip title={label}>
      <StyledAction target="_blank" rel="noopener noreferrer" href={url}>
        <GoToIcon />
      </StyledAction>
    </Tooltip>
  ),
};

export default ({
  user: { isUsingSpotify },
  activeCard: { source, actions },
  path: { cards },
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
