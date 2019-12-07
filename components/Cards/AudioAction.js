import React from 'react';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Tooltip from '@material-ui/core/Tooltip';
import StyledAction from './StyledAction';
import useAudioPlayer from 'lib/useAudioPlayer';

const Component = ({ action: { url, label } }) => {
  const { playing, setPlaying } = useAudioPlayer();

  return (
    <>
      <Tooltip title={`${playing ? 'pause' : 'play'} ${label}`}>
        <StyledAction onClick={() => setPlaying(!playing)}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </StyledAction>
      </Tooltip>
      <audio id="audio">
        <source src={url} />
        Your browser does not support the <code>audio</code> element.
      </audio>
    </>
  );
};

export default Component;
