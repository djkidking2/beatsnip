import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [inputText, setInputText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(inputText);

    // Calculate rate based on desired BPM and default BPM
    const desiredBPM = 120; // Replace with your desired BPM value
    const defaultBPM = 200; // A rough default BPM for normal speech
    const rate = desiredBPM / defaultBPM;

    u.rate = rate; // Adjusting rate based on BPM

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [inputText]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    }

    synth.speak(utterance);

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text to speak"
        rows={4}
        cols={50}
      />
      <div>
        <button onClick={handlePlay}>{isPaused ? 'Resume' : 'Play'}</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
};

export default TextToSpeech;

