import React from "react";
import { useState, useEffect, useContext } from "react";
import "./AddToPlaylistButton.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";

export const AddToPlaylistButton = ({ id }) => {
  const { currentUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {currentUser && (
        <button
          className="add-to-playlist"
          onClick={() => {
            setVisible((prev) => !prev);
          }}
        >
          Add To Playlist
        </button>
      )}
      {visible && <PlaylistList user={currentUser} songId={id} />}
    </div>
  );
};

export const PlaylistList = ({ user, songId }) => {
  
  const navigate = useNavigate();
  if (!songId) {
    const params = useParams();
    songId = params.id;
  }

  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      console.log("user = ", user);
      const email = user.email;
      console.log("user.email = ", user.email);
      const response = await axios.put(
        "http://localhost:3000/playlists/myplaylists",
        { email }
      );
      if (response.status === 200) {
        setPlaylists(response.data.playlists);
        console.log("users playlist have been found");
      } else {
        console.error("Failed to fetch user playlists:", response.data.error);
      }
    };

    fetchData();
  }, []);

  async function addSongToPlaylist(songId, playlistId) {
    console.log(songId, playlistId);
    console.log("add to playlist fired");

    const response = await axios.post("http://localhost:3000/songs/addsong", {
      songId,
      playlistId,
    });

    if (response.status === 200) {
      console.log("hit 200");
      window.alert("Song added to playlist successfully");
    }
  }

  return (
    <div className="existing-playlist">
      <ul className="playlist-list">
        <li>
            <button className="single-playlist-add" onClick={()=> navigate("/playlist/createplaylist")}>
              Create New Playlist +{" "}
            </button>
        </li>
        {playlists.map((playlist, index) => {
          return (
            <li key={index}>
              <button
                className="single-playlist-add"
                onClick={() => addSongToPlaylist(songId, playlist._id)}
              >
                {playlist.title}
              </button>{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
