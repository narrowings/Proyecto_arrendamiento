// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold",
  };

  return (
    <header className="header">
      <nav className="nav-grouped">
        <ul>
          <li>ACERCA DE</li>
          <li>
            <Link to="/login" style={linkStyle}>
              INICIAR SESIÓN
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
