import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { Navbar, Nav, Button, Container } from 'react-bootstrap';


const SAVE_USER = gql`
  mutation SaveUser($name: String!, $email: String!, $pictureUrl: String) {
    saveUser(name: $name, email: $email, pictureUrl: $pictureUrl) {
      name
      email
    }
  }
`;
const HeaderNavbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [saveUser] = useMutation(SAVE_USER);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify the token using Google's token verification endpoint
      fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          const { name, email, picture } = data;
          saveUser({
            variables: {
              name: name,
              email: email,
              pictureUrl: picture,
            },
          })
          if (data.email) {
            setIsLoggedIn(true);
            setUserName(data.name); // You can use data.name or data.email
          } else {
            setIsLoggedIn(false);
            setUserName(null);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserName(null);
        });
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
  };

  useEffect(() => {
    // Check login status when the component mounts
    checkLoginStatus();

    // Listen for changes in localStorage (e.g., after a successful login)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear the access token from localStorage
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserName(null);
  };

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

            {/* Display user's name and Logout button if logged in */}
            {isLoggedIn && (
              <>
                <span className="text-light px-3">Hello, {userName}</span>
                <Button variant="outline-light" onClick={handleLogout} className="ms-3">
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNavbar;
