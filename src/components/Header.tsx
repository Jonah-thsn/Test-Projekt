import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo">
          <span>NEW</span>
          <span style={{ fontWeight: 400 }}>Portal</span>
        </Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/new-report">Meldung erstellen</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
