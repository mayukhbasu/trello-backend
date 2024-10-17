// src/App.tsx
import React from 'react';
import './App.css';
import Users from './Users';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <Users />
      </header>
    </div>
  );
}

export default App;
