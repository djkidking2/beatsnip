import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import InstrumentalSelectionComponent from './components/InstrumentalSelectionComponent';
import LyricInputComponent from './components/LyricInputComponent';
import Hero from './components/Hero';
import Search from './components/Search';
import TextToSpeech from './components/TextToSpeech';
import VoiceRecorder from './components/VoiceRecorder';
import SpotifySearchComponent from './components/SpotifySearchComponent';
import NavBar from './components/Navbar';

function App() {
  const text = "Text-to-speech feature is now available on relatively any website or post. It's a game changer that you can listen to the content instead of reading it. Especially effective for people with visual or cognitive impairments or on the go. I came up with the idea to implement it for my blog, so this is how I started researching this topic which ended up being a tutorial for you. So in this tutorial, we will go through the process of building a text-to-speech component in React. We will use the `Web Speech API` to implement the text-to-speech functionality.";

  return (
    <div className="App">
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Hero />
          </div>
          <div className="col-md-12">
            <Search />
            {/* <SpotifySearchComponent /> */}
            <InstrumentalSelectionComponent />
            <LyricInputComponent />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextToSpeech text={text} />
            <VoiceRecorder />
            <SpotifySearchComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


