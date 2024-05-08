import "./SingleSong.css";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";
import { AddToPlaylistButton } from "../../components/AddToPlaylistButton/AddToPlaylistButton";
import { ArtistsSongs } from "../../components/ArtistsSongs/ArtistsSongs";
export const PlaylistList = ({ user }) => {
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
        // Update the playlists state with the received playlists
        setPlaylists(response.data.playlists);
        console.log("users playlist have been found");
      } else {
        console.error("Failed to fetch user playlists:", response.data.error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="existing-playlist">
      <ul className="playlist-list">
        <li>
          <button className="single-playlist-add">
            Create New Playlist +{" "}
          </button>
        </li>
        {playlists.map((playlist, index) => {
          return (
            <li key={index}>
              <button className="single-playlist-add">{playlist.title}</button>{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export const SingleSong = () => {
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await axios.get(`http://localhost:3000/songs/song/${id}`);
        console.log("data =", data.data);
        if (data && data.data && !data.data.error) {
          setSongData(data.data);
        } else {
          setSongData(null);
        }

        setErrorMessage("");
      } catch (e) {
        setErrorMessage(e.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }
  if (loading) {
    return <div>Loading...</div>;
  } else if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  } else if (!songData) {
    return <div>No song found with ID: {id}</div>;
  }
  return (
    <>
      <div className="single-song">
        <div className="left-stuff">
          {songData.album && songData.album.cover_medium && (
            <img
              src={songData.album.cover_medium}
              alt={songData.album.cover_medium}
            />
          )}

          {songData.preview && (
            <video controls={true} className="preview">
              <source src={songData.preview} type="audio/mpeg" />
            </video>
          )}
          {songData.title && songData.artist && (
            <h1 className="song-title">{songData.title}</h1>
          )}
          {songData.artist && songData.duration && songData.artist.name && (
            <h1 className="album-artist">
              <span>{songData.artist.name}</span> .{" "}
              <span>{secondsToMinutes(songData.duration)}</span>
            </h1>
          )}

          {songData.artist && songData.artist.picture_medium && (
            <img
              src={songData.artist.picture_medium}
              alt={songData.artist.picture_medium}
              className="artist-image"
            />
          )}
          {songData.artist && songData.artist.name && (
            <h1 className="artist-name">Artist: {songData.artist.name}</h1>
          )}
          {songData.album && (
            <h2 className="album-name">Album : {songData.album.title}</h2>
          )}
          {songData.explicit_lyrics ? (
            <h3 className="explicit">Explicit</h3>
          ) : (
            <h3 className="album-name">Non-Explicit</h3>
          )}
        </div>

        <div className="right-stuff">
          {songData.release_date && (
            <h2 className="release-date">
              Release Date: {songData.release_date}
            </h2>
          )}

          {/* add to playlist button  */}
          <AddToPlaylistButton id={songData.id} />
        </div>

        <ArtistsSongs artistId={songData.artist.id} />
      </div>
    </>
  );
};
