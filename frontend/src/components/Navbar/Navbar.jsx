import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { doSignOut } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};
const NavigationAuth = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <button className="button" type="button" onClick={doSignOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};
const NavigationNonAuth = () => {
  return (
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
  );
};
