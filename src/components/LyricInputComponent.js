import React, { useState } from 'react';

const LyricInputComponent = () => {
  const [lyrics, setLyrics] = useState('');

  const handleLyricChange = (event) => {
    setLyrics(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle submitting lyrics (e.g., storing in state)
  };

  return (
    <div className="container">
      <h2 className="my-4">Enter Lyrics</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={lyrics}
            onChange={handleLyricChange}
            placeholder="Enter lyrics..."
            rows={4}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LyricInputComponent;

