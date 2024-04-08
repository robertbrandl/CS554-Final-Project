import React, {useContext} from 'react';
import "./Mainbar.css";
import { Link } from "react-router-dom";
import {AuthContext} from '../../firebase/Auth';
export const Mainbar = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};
const NavigationAuth = () => {
  return (
    <nav className="mainbar">
      <ul>
        <li>
          <Link to="/songsearch">
            Browse Songs
          </Link>
        </li>
        <li>
          <Link to="/allplaylists">
            View All Playlists
          </Link>
        </li>
        <li>
          <Link to="/followedplaylists">
            View Playlists By Your Followed Accounts
          </Link>
        </li>
        <li>
          <Link to="/statistics">
            Your Statistics
          </Link>
        </li>
      </ul>
    </nav>
  );
};
const NavigationNonAuth = () => {
  return (
    <nav className="mainbar">
      <ul>
      <li>
          <Link to="/songsearch">
            Browse Songs
          </Link>
        </li>
        <li>
          <Link to="/allplaylists">
            View All Playlists
          </Link>
        </li>
      </ul>
    </nav>
  );
};
