import React from 'react';
import './HomePage.css'; // Add custom styles
import { Container, Button } from 'react-bootstrap';


const HomePage: React.FC = () => {
  return (
    <>
      <Container>
        <h1 className="mb-4">Welcome to Trello</h1>
        <div className="button-group">
          <Button href="#sign-in" variant="outline-light" size="lg" className="me-3">
            Sign In
          </Button>
          <Button href="#sign-up" variant="primary" size="lg">
            Sign Up
          </Button>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
