// src/App.tsx
import './App.css';
import Users from './Users';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderNavbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <HeaderNavbar/>
      <header className="App-header">
        <Users />
      </header>
    </div>
  );
}

export default App;
