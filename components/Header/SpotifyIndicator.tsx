import React from 'react';
import { IconButton } from '@material-ui/core';
// import swallowingStyled from '../../lib/swallowingStyled';
import styled from 'styled-components';

// / const SpotifyIndicator = swallowingStyled(IconButton, {
//   swallowProps: ['isSpotifyLinked'],
// })`
// // eslint-disable-next-line @typescript-eslint/no-unused-va
const Unstyled = ({ isSpotifyLinked, ...rest }) => {
  console.log('isSpotLinked', isSpotifyLinked);
  return <IconButton {...rest} />;
};

const SpotifyIndicator = styled(Unstyled)`
  position: absolute !important;
  top: 5px;
  right: 5px;
  -webkit-appearance: none;
  border: none;

  .logo {
    filter: ${props => (props.isSpotifyLinked ? 'none' : 'grayscale(100%)')};
    height: 20px;
    width: 20px;
  }
`;

export default SpotifyIndicator;
