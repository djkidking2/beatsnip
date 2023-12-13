import React, { useState, useEffect } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  Modal,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPlayer from 'react-player';

const CLIENT_ID = "7de7793f52cb4f979a2d5ae2f69c88cf";
const CLIENT_SECRET = "b7a6a02b7eb04d79acdf6220cfd8e563";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [albums, setAlbums] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [showSongsModal, setShowSongsModal] = useState(false);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);

  // Fetch access token on initial render
  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => console.error("Error fetching access token:", error));
  }, []);

  // Function to search for albums based on user input
  const search = async () => {
    console.log("Search for " + searchInput);

    try {
      const artistParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=album`,
        artistParameters
      );

      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }

      const data = await response.json();
      console.log(data);

      if (data.albums && data.albums.items) {
        setAlbums(data.albums.items); // Update albums state with parsed album data
      } else {
        setAlbums([]); // Clear albums state if no albums found
      }
    } catch (error) {
      console.error("Error searching for albums:", error);
      setAlbums([]); // Handle error by clearing albums state or setting it to an empty array
    }
  };

  // Function to fetch songs of a selected album
  const fetchAlbumSongs = async (albumId) => {
    try {
      const songsResponse = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!songsResponse.ok) {
        throw new Error("Failed to fetch album songs");
      }

      const songsData = await songsResponse.json();
      console.log(songsData);

      if (songsData.items) {
        setAlbumSongs(songsData.items);
      } else {
        setAlbumSongs([]);
      }

      setShowSongsModal(true); // Show modal with album songs
    } catch (error) {
      console.error("Error fetching album songs:", error);
      setAlbumSongs([]);
      setShowSongsModal(false);
    }
  };

  // Function to close the modal and reset album song states
  const handleCloseSongsModal = () => {
    setAlbumSongs([]);
    setCurrentSongUrl(null);
    setShowSongsModal(false);
  };

  // Function to play the selected song
  const handlePlaySong = (songUrl) => {
    setCurrentSongUrl(songUrl);
  };

  return (
    <div className="Search">
      <Container>
        <h2 className="mt-3">Search By Artist</h2>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Album"
            type="input"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>

        <Row className="mx-2">
          {albums.map((album) => (
            <Col key={album.id} xs={6} sm={6} md={3} lg={3} className="mb-3">
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => fetchAlbumSongs(album.id)}
              >
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showSongsModal} onHide={handleCloseSongsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Album Songs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {albumSongs.map((song) => (
              <ListGroup.Item
                key={song.id}
                onClick={() => handlePlaySong(song.preview_url)}
              >
                {song.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          {currentSongUrl && (
            <ReactPlayer
              url={currentSongUrl}
              controls={true}
              playing={true}
              width="100%"
              height="50px"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Search;