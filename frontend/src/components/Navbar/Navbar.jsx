import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
export const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link exact to="/">
            Home
          </Link>
        </li>
        <li>
          <Link exact to="/login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};
