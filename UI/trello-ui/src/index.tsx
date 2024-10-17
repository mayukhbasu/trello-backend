// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import 'react-dom/client' for React 18
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // Use createRoot instead of render

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
