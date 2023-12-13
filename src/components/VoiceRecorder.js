import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayerRef = useRef(null);

  // Function to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorderInstance = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorderInstance);

      mediaRecorderInstance.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks([...audioChunks, event.data]);
        }
      };

      mediaRecorderInstance.start();
    } catch (error) {
      console.error('Error accessing the microphone:', error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      audioStream.getTracks().forEach((track) => track.stop());

      const recordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const recordedAudioURL = URL.createObjectURL(recordedAudioBlob);
      setRecordedAudioURL(recordedAudioURL);
    }
  };

  // Function to play recorded audio over selected track
  const playLayeredAudio = () => {
    if (recordedAudioURL && selectedTrack) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      // Load recorded audio chunk
      fetch(recordedAudioURL)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          source.buffer = audioBuffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
        })
        .catch((error) => console.error('Error loading recorded audio:', error));

      // Load selected track
      audioPlayerRef.current.src = URL.createObjectURL(selectedTrack);
      audioPlayerRef.current.play();
      
      // Play both the selected track and recorded audio chunk
      audioPlayerRef.current.onplay = () => {
        setIsPlaying(true);
        source.start();
      };
      
      // Stop playing when audio ends
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
        source.stop();
      };
    }
  };

  // Function to handle track change
  const handleTrackChange = (e) => {
    setSelectedTrack(e.target.files[0]);
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <input type="file" accept="audio/*" onChange={handleTrackChange} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={playLayeredAudio} disabled={!recordedAudioURL || !selectedTrack || isPlaying}>
        Play Layered Audio
      </button>
      <audio ref={audioPlayerRef} controls />
    </div>
  );
};

export default VoiceRecorder;








