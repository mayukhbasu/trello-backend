import React from 'react';
import './HomePage.css'; // Add custom styles
import { Container, Button } from 'react-bootstrap';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const clientId = '104926798924-0m8a4e0l1elhus477miu6er0n8r1forf.apps.googleusercontent.com'; // Replace with your actual Google Client ID

const HomePage: React.FC = () => {

  const handleLoginSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    localStorage.setItem('access_token', token);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Container>
        <h1 className="mb-4">Welcome to Trello</h1>
        <div className="button-group">
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              size="large"
              text="continue_with"
            />
          </div>
        </div>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default HomePage;
