import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, ListGroup } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import playlistImage from './images/playlist_image.png'; // Replace with your image URL
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component

const CLIENT_ID = '7de7793f52cb4f979a2d5ae2f69c88cf';
const CLIENT_SECRET = 'b7a6a02b7eb04d79acdf6220cfd8e563';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, ] = useState([]);
  const [showPodcasts, setShowPodcasts] = useState(false);
  const [podcasts, setPodcasts] = useState([]);
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // State to control visibility of CreatePlaylist


  const fetchPodcasts = async () => {
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch access token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const response = await fetch('https://api.spotify.com/v1/shows/2yB9jTRog4XGCKG5bpNZUA?market=FI', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch podcasts');
      }
  
      const data = await response.json();
      console.log(data);
      const podcast = {
        id: data.id,
        title: data.name,
        image: data.images && data.images.length > 0 ? data.images[0].url : '', // Check for image availability
        // Add other necessary podcast data here...
        episodes: {
          href: data.episodes.href,
          items: data.episodes.items,
        },
      };
  
      setPodcasts([podcast]);
      setShowPodcasts(true);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    }
  };

  const handleBrowseEpisodes = (podcast) => {
    setSelectedPodcast(podcast);
    setShowEpisodesModal(true);
  };

  const handleSearch = async () => {
    try {
      // Add logic to perform search for shows here...
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  return (
    <Container>
      <Row className="py-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Create Your First Playlist</Card.Title>
              <Card.Text>
                Start creating your favorite playlist and enjoy music tailored to your taste.
              </Card.Text>
              {/* Button to create playlist */}
      <Button variant="primary" onClick={() => setShowCreatePlaylist(true)}>
        Create Playlist
      </Button>

      {/* Conditionally render CreatePlaylist component */}
      {showCreatePlaylist && <CreatePlaylist />}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Container>
              <Row>
                <Col md={12}>
                  <Card.Img src={playlistImage} alt="Playlist" />
                </Col>
              </Row>
            </Container>
            <Card.Body>
              <Card.Title>Browse Podcasts</Card.Title>
              <Card.Text>
                Discover a wide range of podcasts covering various topics and genres.
              </Card.Text>
              <Button variant="primary" onClick={fetchPodcasts}>
                Browse Podcasts
              </Button>
              {showPodcasts && (
                <Container className="mt-3">
                  <Row>
                    {podcasts.map((podcast) => (
                      <Col md={4} key={podcast.id} className="mb-4">
                        <Card>
                          <Card.Img variant="top" src={podcast.image} alt={podcast.title} />
                          <Card.Body>
                            <Card.Title>{podcast.title}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Container>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
          {searchResults.map((show) => (
            <Card key={show.id}>
              <Card.Body>
                <Card.Title>{show.name}</Card.Title>
                {/* Add other show details here */}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      {/* Display fetched podcasts */}
      {showPodcasts && (
        <Col md={12}>
          <h2>Fetched Podcasts</h2>
          <Row>
            {podcasts.map((podcast) => (
              <Col md={4} key={podcast.id} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={podcast.image} alt={podcast.title} />
                  <Card.Body>
                    <Card.Title>{podcast.title}</Card.Title>
                    <Button onClick={() => handleBrowseEpisodes(podcast)}>Browse Episodes</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      )}

      {/* Modal to display episodes */}
      <Modal show={showEpisodesModal} onHide={() => setShowEpisodesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPodcast?.title} Episodes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {selectedPodcast?.episodes?.items.map((episode) => (
              <ListGroup.Item key={episode.id}>
                {episode.name}
                {/* Add more episode details as needed */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Hero;








