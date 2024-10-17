import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const HeaderNavbar: React.FC = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <i className="bi bi-house-door me-2"></i>
          <span>Trello</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#home" className="px-3">
              Home
            </Nav.Link>
            <Nav.Link href="#features" className="px-3">
              Features
            </Nav.Link>
            <Nav.Link href="#pricing" className="px-3">
              Pricing
            </Nav.Link>

            {/* Sign Up Button - primary colored */}
            <Button
              variant="primary"
              href="#sign-up"
              className="ms-3"
              style={{ borderRadius: '50px', padding: '0.5rem 1.5rem' }}
            >
              Sign Up
            </Button>

            {/* Sign In Button - outlined light */}
            <Button
              variant="outline-light"
              href="#sign-in"
              className="ms-3"
              style={{ borderRadius: '50px', padding: '0.5rem 1.5rem' }}
            >
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNavbar;
