// src/App.tsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderNavbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <HeaderNavbar/>
      <header className="App-header">
        <HomePage />
      </header>
    </div>
  );
}

export default App;
