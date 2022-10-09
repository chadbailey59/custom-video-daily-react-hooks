import React from 'react';
import './HomeScreen.css';

export default function HomeScreen({ startHairCheck }) {
  const startDemo = () => {
      startHairCheck("https://chad-hq.daily.co/demuxed");
  };

  return (
    <div className="home-screen">
      <h1>React Daily Hooks custom video app: Demuxed edition</h1>
      <p>Join the Demuxed room by clicking the button below.</p>
      <button onClick={startDemo} type="button">Click to start</button>
      <p className="small">Select “Allow” to use your camera and mic for this call if prompted.</p>
    </div>
  );
}
