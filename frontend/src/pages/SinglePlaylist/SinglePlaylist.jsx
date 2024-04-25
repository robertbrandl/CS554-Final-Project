import "./SinglePlaylist.css";
import { useState, useEffect } from "react";
import axios from "axios";
export const SinglePlaylist = ({ id }) => {
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/Playlist/${id}`)
      .then((res) => setPlaylistData(res.data));
  }, [id]);
  return <div>SinglePlaylist</div>;
};
