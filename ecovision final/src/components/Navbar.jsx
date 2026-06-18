import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/logos/logo-ak.jpg" alt="AK Logo" className="logo-img" />
        <h1>EcoVision</h1>
      </Link>

      <nav>
        {location.pathname === '/' ? (
          <>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#objectives">Objectives</a>
            <Link to="/upload">Upload</Link>
            <Link to="/result">Result</Link>
            <a href="#team">Team</a>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/result">Result</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
