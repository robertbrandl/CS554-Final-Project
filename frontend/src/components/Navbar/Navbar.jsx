import React, { useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate} from "react-router-dom";
import { doSignOut } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};
const NavigationAuth = () => {
  const navigate = useNavigate();
  const signout = () =>{
    doSignOut();
    navigate("/")
  }
  return (
    <>
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/" className="playlist-hub">PlaylistHub</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <button className="btn" type="button" onClick={signout}>
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
    <nav className="mainbar">
    <ul>
      <li>
        <Link to="/songsearch">Browse Songs</Link>
      </li>
      <li>
        <Link to="/allplaylists">View All Playlists</Link>
      </li>
      <li>
        <Link to="/followedplaylists">
          View Playlists By Your Followed Accounts
        </Link>
      </li>
      <li>
        <Link to="/myplaylists">View Your Playlists</Link>
      </li>
      <li>
        <Link to="/statistics">Your Statistics</Link>
      </li>
    </ul>
    </nav>
    </>
  );
};
const NavigationNonAuth = () => {
  return (
    <>
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Create an Account</Link>
        </li>
      </ul>
    </nav>
    <nav className="mainbar">
    <ul>
      <li>
        <Link to="/songsearch">Browse Songs</Link>
      </li>
      <li>
        <Link to="/allplaylists">View All Playlists</Link>
      </li>
    </ul>
  </nav>
  </>
  );
};
