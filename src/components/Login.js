import React from 'react';
import './Login.css'; // Import your CSS file for additional styling

const CLIENT_ID = '7de7793f52cb4f979a2d5ae2f69c88cf';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPE = 'playlist-modify-private';

const Login = () => {
  const handleLogin = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = `client_id=${CLIENT_ID}`;
    const redirectUri = `redirect_uri=${REDIRECT_URI}`;
    const scope = `scope=${SCOPE}`;
    const responseType = 'response_type=token';
    const url = `${authEndpoint}?${clientId}&${redirectUri}&${scope}&${responseType}`;
    window.location.href = url;
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 text-center">
          <h2>Spotify Login</h2>
          <button onClick={handleLogin} className="btn btn-success btn-lg mt-3">
            Login with Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
