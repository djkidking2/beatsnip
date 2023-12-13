import React, { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer"; // Import the AudioPlayer component
const CLIENT_ID = "7de7793f52cb4f979a2d5ae2f69c88cf";
const CLIENT_SECRET = "b7a6a02b7eb04d79acdf6220cfd8e563";

const InstrumentalSelectionComponent = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [instrumentals, setInstrumentals] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
            },
            body: "grant_type=client_credentials",
          }
        );

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          const genresResponse = await fetch(
            "https://api.spotify.com/v1/browse/categories",
            {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }
          );

          if (genresResponse.ok) {
            const genresData = await genresResponse.json();
            setGenres(genresData.categories.items || []);
          } else {
            throw new Error("Failed to fetch genres");
          }
        } else {
          throw new Error("Failed to fetch access token");
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = async (event) => {
    setSelectedGenre(event.target.value);

    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
          },
          body: "grant_type=client_credentials",
        }
      );

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const genreResponse = await fetch(
          `https://api.spotify.com/v1/browse/categories/${event.target.value}/playlists`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        if (genreResponse.ok) {
          const genreData = await genreResponse.json();
          setInstrumentals(genreData.playlists.items || []);
        } else {
          throw new Error("Failed to fetch instrumental tracks");
        }
      } else {
        throw new Error("Failed to fetch access token");
      }
    } catch (error) {
      console.error("Error fetching instrumentals:", error);
    }
  };

  const handleTrackSelect = async (track) => {
    setSelectedTrack(track);

    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
          },
          body: "grant_type=client_credentials",
        }
      );

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const playlistTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${track.id}/tracks`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        if (playlistTracksResponse.ok) {
          const playlistTracksData = await playlistTracksResponse.json();
          setPlaylistTracks(playlistTracksData.items || []);
        } else {
          throw new Error("Failed to fetch playlist tracks");
        }
      } else {
        throw new Error("Failed to fetch access token");
      }
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Select Music by Genre</h2>
      <select
        className="form-select form-select-lg mb-3"
        aria-label="Select Genre"
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="">Select Genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <div>
        <h3>Playlists</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {instrumentals && instrumentals.length > 0 ? (
            instrumentals.map((track) => (
              <div key={track.id} className="col">
                <div className="card h-100" onClick={() => handleTrackSelect(track)}>
                  {track.images && track.images.length > 0 && track.images[0].url ? (
                    <img src={track.images[0].url} className="card-img-top" alt={track.name} />
                  ) : (
                    <div className="placeholder-image">
                      {/* Placeholder or default image when 'images' is empty */}
                    </div>
                  )}
                  <div className="card-body">
                    <p className="card-text">{track.name}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No instrumental tracks available</p>
          )}
        </div>
      </div>

      {selectedTrack && (
        <div className="selected-track">
          <h4>Selected Track: {selectedTrack.name}</h4>
          <p>Album: {selectedTrack.album}</p>
          <p>Artist: {selectedTrack.artist}</p>

          <h3>Playlist Tracks</h3>
          {playlistTracks && playlistTracks.length > 0 ? (
            <div className="row">
              {playlistTracks.map((track, index) => (
                <div key={`${track.track.id}-${index}`} className="col-12 col-md-6 col-lg-4 mb-3">
                  <div className="card">
                    <div className="row g-0">
                      <div className="col-4">
                        <img
                          src={track.track.album.images[0].url}
                          alt={track.track.album.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-8">
                        <div className="card-body">
                          <p className="card-text">{track.track.name}</p>
                          <p className="card-text">{track.track.artists[0].name}</p>
                          <AudioPlayer src={track.track.preview_url} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No tracks in the playlist</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InstrumentalSelectionComponent;