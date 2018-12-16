import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Audio, actions } from 'redux-audio';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Tooltip from '@material-ui/core/Tooltip';
import StyledAction from './StyledAction';

const Component = ({ action: { label, url }, audio, playOrPausePreview }) => {
  const state = !!audio && audio.get('state');
  return (
    <div>
      {audio && (
        <Tooltip title={`${state === 'playing' ? 'pause' : 'play'} ${label}`}>
          <StyledAction onClick={playOrPausePreview}>
            {state === 'playing' ? <PauseIcon /> : <PlayIcon />}
          </StyledAction>
        </Tooltip>
      )}
      <Audio src={url} uniqueId={url} />
    </div>
  );
};

const mapStateToProps = ({ audio }, { action: { url, label } }) => ({
  audio: audio.get(url),
  url,
  label,
});
const mapDispatchToProps = { ...actions };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    playOrPausePreview: props => () => {
      const { audio, url, audioPlay, audioPause } = props;
      switch (audio.get('state')) {
        case 'playing':
          audioPause(url);
          break;
        case 'paused':
        case 'ended':
        case 'none':
          audioPlay(url);
          break;
        default:
          break;
      }
    },
  })
)(Component);
