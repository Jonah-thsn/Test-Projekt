import React from 'react';
import './Layout.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Über NEW</h4>
            <ul>
              <li><a href="#">Das Unternehmen</a></li>
              <li><a href="#">Karriere</a></li>
              <li><a href="#">Nachhaltigkeit</a></li>
              <li><a href="#">Presse</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Störung melden</a></li>
              <li><a href="#">Zählerstand</a></li>
              <li><a href="#">Tarifberater</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="#">Impressum</a></li>
              <li><a href="#">Datenschutz</a></li>
              <li><a href="#">AGB</a></li>
              <li><a href="#">Compliance</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Kontakt</h4>
            <ul>
              <li><a href="#">Kontaktformular</a></li>
              <li><a href="#">0800 6 886881</a></li>
              <li><a href="#">NEW AG</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NEW Gruppe. Alle Rechte vorbehalten.</p>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn">LinkedIn</a> | 
            <a href="#" aria-label="Xing">Xing</a> | 
            <a href="#" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
