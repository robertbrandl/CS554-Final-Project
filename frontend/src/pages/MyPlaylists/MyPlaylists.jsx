import React, { useContext } from "react";
import "./MyPlaylists.css";
import { AuthContext } from "../../firebase/Auth";
import { AccountPlaylists } from "../../components/AccountPlaylists/AccountPlaylists";
import { Link, useNavigate } from "react-router-dom";
export const MyPlaylists = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>MyPlaylists</h1>
      {/* create playlist button */}
        <button className="create-playlist-button" onClick={()=> navigate("/playlist/createplaylist")}>
          Create New Playlist +{" "}
        </button>
      <AccountPlaylists user={currentUser} />
    </div>
  );
};
