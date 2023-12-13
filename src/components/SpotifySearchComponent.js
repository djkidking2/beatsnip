import React, { useState, useEffect } from "react";

const CLIENT_ID = "7de7793f52cb4f979a2d5ae2f69c88cf";
const CLIENT_SECRET = "b7a6a02b7eb04d79acdf6220cfd8e563";

const SpotifySearchComponent = () => {
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [artistInfo, setArtistInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedArtistId) return;

    const fetchArtistInfo = async () => {
      try {
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
          },
          body: "grant_type=client_credentials",
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to fetch access token");
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!artistResponse.ok) {
          throw new Error("Failed to fetch artist information");
        }

        const artistData = await artistResponse.json();
        setArtistInfo(artistData);
        setError(null);
      } catch (error) {
        console.error("Error fetching artist information:", error);
        setArtistInfo(null);
        setError("Failed to fetch artist information. Please try again.");
      }
    };

    fetchArtistInfo();
  }, [selectedArtistId]);

  const handleInputChange = (event) => {
    setSelectedArtistId(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSelectedArtistId(event.target.value);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-3">Search Artist</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search for Artist"
        value={selectedArtistId}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {artistInfo && (
        <div className="mt-3">
          <h2>{artistInfo.name}</h2>
          <p>Followers: {artistInfo.followers.total}</p>
          <p>Genres: {artistInfo.genres.join(", ")}</p>
          <img src={artistInfo.images[0].url} alt={artistInfo.name} className="img-fluid" />
        </div>
      )}
    </div>
  );
};

export default SpotifySearchComponent;
