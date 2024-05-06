import React, { useContext } from "react";
import "./MyPlaylists.css";
import { AuthContext } from "../../firebase/Auth";
import { AccountPlaylists } from "../../components/AccountPlaylists/AccountPlaylists";
import { Link } from "react-router-dom";
export const MyPlaylists = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <h1>MyPlaylists</h1>
      {/* create playlist button */}
      <Link to="/playlist/createplaylist">
        <button className="create-playlist-button">
          Create New Playlist +{" "}
        </button>
      </Link>
      <AccountPlaylists user={currentUser} />
    </div>
  );
};
