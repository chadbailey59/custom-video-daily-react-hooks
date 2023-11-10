import './Tile.css';
import { DailyVideo, useMediaTrack, DailyAudioTrack } from '@daily-co/daily-react';
import Username from '../Username/Username';
import Subtitle from '../Subtitle/Subtitle';

export default function Tile({ id, isScreenShare, isLocal, isAlone }) {
  const videoState = useMediaTrack(id, 'video');

  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  if (isLocal) {
    containerCssClasses += ' self-view';
    if (isAlone) {
      containerCssClasses += ' alone';
    }
  }

  /* If a participant's video is muted, hide their video and
  add a different background color to their tile. */
  if (videoState.isOff) {
    containerCssClasses += ' no-video';
  }

  return (
    <>
      <div className={containerCssClasses}>
        <DailyVideo
          automirror
          sessionId={id}
          type={isScreenShare ? 'screenVideo' : 'video'}
          fit="cover"
        />
        <Username id={id} isLocal={isLocal} />
        <Subtitle id={id} />
      </div>
      {/* !isLocal && <DailyAudioTrack sessionId={id} type="audio" /> */}
    </>
  );
}
