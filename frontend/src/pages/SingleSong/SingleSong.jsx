import "./SingleSong.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export const PlaylistList = () => {
  return (
    <div className="existing-playlist">
      <ul className="playlist-list">
        <li>
          <button className="single-playlist-add">
            Create New Playlist +{" "}
          </button>
        </li>
        <li>
          <button className="single-playlist-add">Playlist 1 </button>{" "}
        </li>
        <li>
          <button className="single-playlist-add">Playlist 2 </button>
        </li>
        <li>
          <button className="single-playlist-add">Playlist 3</button>
        </li>
      </ul>
    </div>
  );
};
export const SingleSong = () => {
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await axios.get(`http://localhost:3000/songs/song/${id}`);
        console.log("data =", data);
        setSongData(data.data);

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
        {songData.title && <h1>{songData.title}</h1>}
        <button
          className="add-to-playlist"
          onClick={() => {
            setVisible((prev) => !prev);
          }}
        >
          Add To Playlist
        </button>

        {songData.artist.name && <h2>By : {songData.artist.name}</h2>}

        {songData.artist.picture_medium && (
          <img
            src={songData.artist.picture_medium}
            alt={songData.artist.picture_medium}
            className="artist-image"
          />
        )}

        {songData.release_date && (
          <h2>Release Date: {songData.release_date}</h2>
        )}
        {visible && <PlaylistList />}

        {songData.album.cover_medium && (
          <img
            src={songData.album.cover_medium}
            alt={songData.album.cover_medium}
          />
        )}
        {songData.duration && (
          <h3>Duration : {secondsToMinutes(songData.duration)}</h3>
        )}
        {songData.explicit_lyrics ? (
          <h3 className="explicit">Explicit</h3>
        ) : (
          <h3>Non-Explicit</h3>
        )}
        {songData.preview && (
          <video controls={true} className="preview">
            <source src={songData.preview} type="audio/mpeg" />
          </video>
        )}
        {songData.album && <h2>Album : {songData.album.title}</h2>}
      </div>
    </>
  );
};
