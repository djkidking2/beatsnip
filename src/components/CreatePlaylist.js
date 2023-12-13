import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import 'bootstrap/dist/css/bootstrap.min.css';

const spotifyApi = new SpotifyWebApi();
const CLIENT_ID = '7de7793f52cb4f979a2d5ae2f69c88cf';
const CLIENT_SECRET = 'b7a6a02b7eb04d79acdf6220cfd8e563';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Fetch or set the access token
    const getToken = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      setAccessToken(data.access_token);

      // Set the access token for Spotify Web API
      if (data.access_token) {
        spotifyApi.setAccessToken(data.access_token);
      }
    };

    getToken();
  }, []);

  const handleCreatePlaylist = async () => {
    try {
      // Make sure there's a valid access token
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Create the playlist
      const createdPlaylist = await spotifyApi.createPlaylist(playlistName, { public: true });

      // Set the created playlist's ID
      setPlaylistId(createdPlaylist.id);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Create Spotify Playlist</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Playlist Name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreatePlaylist}>Create Playlist</button>
      </div>
      {playlistId && (
        <p className="text-center">
          Playlist created! ID: <a href={`https://open.spotify.com/playlist/${playlistId}`} target="_blank" rel="noopener noreferrer">{playlistId}</a>
        </p>
      )}
    </div>
  );
};

export default CreatePlaylist;
