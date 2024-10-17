import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const HeaderNavbar: React.FC = () => {

  const handleSignIn = () => {
    const clientId = '104926798924-0m8a4e0l1elhus477miu6er0n8r1forf.apps.googleusercontent.com'; // Replace with your Google client ID
    const redirectUri = 'http://localhost:3000/oauth2/callback'; // Replace with your redirect URI
    const scope = 'profile email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline`;
    window.location.href = authUrl;
  }


  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#">
          <i className="bi bi-house-door"></i> Trello
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Button variant="outline-light" href="#sign-in" className="ms-3" onClick={handleSignIn}>
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNavbar;
