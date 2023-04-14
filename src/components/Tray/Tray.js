import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
} from '@daily-co/daily-react';

import MeetingInformation from '../MeetingInformation/MeetingInformation';
import Chat from '../Chat/Chat';

import './Tray.css';
import {
  CameraOn,
  Leave,
  CameraOff,
  MicrophoneOff,
  MicrophoneOn,
  Screenshare,
  Info,
  ChatIcon,
  ChatHighlighted,
} from './Icons';

export default function Tray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();

  const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState(false);

  const localParticipant = useLocalParticipant();
  const localVideo = useVideoTrack(localParticipant?.session_id);
  const localAudio = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;

  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioContext = useRef(new AudioContext());
  const audioEl = useRef();
  const track = useRef();
  const [outVolume, setOutVolume] = useState(100);

  /* When a remote participant sends a message in the chat, we want to display a differently colored
   * chat icon in the Tray as a notification. By listening for the `"app-message"` event we'll know
   * when someone has sent a message. */
  useDailyEvent(
    'app-message',
    useCallback(() => {
      /* Only light up the chat icon if the chat isn't already open. */
      if (!showChat) {
        setNewChatMessage(true);
      }
    }, [showChat]),
  );

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const toggleScreenShare = () => (isSharingScreen ? stopScreenShare() : startScreenShare());

  const toggleMeetingInformation = () => {
    setShowMeetingInformation(!showMeetingInformation);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (newChatMessage) {
      setNewChatMessage(!newChatMessage);
    }
  };

  useEffect(() => {
    if (audioEl.current) {
      if (!track.current) {
        track.current = audioContext.current.createMediaElementSource(audioEl.current);
        // start it up
        const destNode = audioContext.current.createMediaStreamDestination();

        track.current.connect(destNode);
        callObject.startCustomTrack({
          track: destNode.stream.getAudioTracks()[0],
          mode: 'music',
          trackName: 'music0',
        });
      }
      if (musicPlaying) {
        audioEl.current.play();
      } else {
        // turn it off
        audioEl.current.pause();
        console.log({ track });
      }
    } else {
      // no audio element yet, ignore
    }
  }, [musicPlaying]);

  useEffect(() => {
    callObject.sendAppMessage({ msg: 'change-out-volume', volume: outVolume });
  }, [outVolume]);

  const handleOutVolumeChange = (e) => {
    console.log('new out volume: ', e.target.value);

    setOutVolume(e.target.value);
  };
  return (
    <div className="tray">
      {showMeetingInformation && <MeetingInformation />}
      {/*  The chat messages 'live' in the <Chat/> component's state. We can't just remove the component */}
      {/*  from the DOM when hiding the chat, because that would cause us to lose that state. So we're */}
      {/*  choosing a slightly different approach of toggling the chat: always render the component, but only */}
      {/*  render its HTML when showChat is set to true. */}

      {/*   We're also passing down the toggleChat() function to the component, so we can open and close the chat */}
      {/*   from the chat UI and not just the Tray. */}
      <Chat showChat={showChat} toggleChat={toggleChat} />
      <div className="tray-buttons-container">
        <div className="controls">
          <button onClick={toggleVideo} type="button">
            {mutedVideo ? <CameraOff /> : <CameraOn />}
            {mutedVideo ? 'Turn camera on' : 'Turn camera off'}
          </button>
          <button onClick={toggleAudio} type="button">
            {mutedAudio ? <MicrophoneOff /> : <MicrophoneOn />}
            {mutedAudio ? 'Unmute mic' : 'Mute mic'}
          </button>
          <audio ref={audioEl} id="music" src="rygar.webm" />

          <button onClick={() => setMusicPlaying(!musicPlaying)} type="button">
            {musicPlaying ? 'Stop Music' : 'Start Music'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={outVolume}
            onChange={handleOutVolumeChange}
            id="myRange"
          />
        </div>
        <div className="actions">
          <button onClick={toggleScreenShare} type="button">
            <Screenshare />
            {isSharingScreen ? 'Stop sharing screen' : 'Share screen'}
          </button>
          <button onClick={toggleMeetingInformation} type="button">
            <Info />
            {showMeetingInformation ? 'Hide info' : 'Show info'}
          </button>
          <button onClick={toggleChat} type="button">
            {newChatMessage ? <ChatHighlighted /> : <ChatIcon />}
            {showChat ? 'Hide chat' : 'Show chat'}
          </button>
        </div>
        <div className="leave">
          <button onClick={leaveCall} type="button">
            <Leave /> Leave call
          </button>
        </div>
      </div>
    </div>
  );
}
