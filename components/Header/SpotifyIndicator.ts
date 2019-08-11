import { IconButton } from '@material-ui/core';
import swallowingStyled from '../../lib/swallowingStyled';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const SpotifyIndicator = styled(({ isSpotifyLinked, ...rest }) => (
//   <IconButton {...rest} />
// ))`
const SpotifyIndicator = swallowingStyled(IconButton, {
  swallowProps: ['isSpotifyLinked'],
})`
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
