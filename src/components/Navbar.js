import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'; // Import the Login component
import SignUp from './SignUp';

const NavBar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">BeatSnip</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button variant="outline-light" className="mr-2" onClick={handleSignUpClick}>Sign Up</Button>
            <Button variant="outline-light" onClick={handleLoginClick}>Login</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {showSignUp && <SignUp />} {/* Conditionally render the Login component */}
      {showLogin && <Login />} {/* Conditionally render the Login component */}
    </div>
  );
};

export default NavBar;

