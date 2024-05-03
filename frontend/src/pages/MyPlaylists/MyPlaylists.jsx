import React, { useContext } from "react";
import "./MyPlaylists.css";
import { AuthContext } from "../../firebase/Auth";
import { AccountPlaylists } from "../../components/AccountPlaylists/AccountPlaylists";
export const MyPlaylists = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <h1>MyPlaylists</h1>
      <AccountPlaylists user={currentUser} />
    </div>
  );
};
