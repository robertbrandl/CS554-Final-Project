import "./SinglePlaylist.css";
import albumImage from "../../assets/album.png";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
export const SinglePlaylist = () => {
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function formatTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  const [playlistData, setPlaylistData] = useState(null);
  const [songsData, setSongsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setError("");
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/playlists/playlist/${id}`
        );
        console.log(response.data);

        setPlaylistData(response.data.playlist);
        setSongsData(response.data.songs.songsArray);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);
  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="single-playlist">
      {playlistData && (
        <div>
          {/* <img src={playlistData.albumCover} /> */}
          <img
            className="album-cover"
            src={albumImage}
            alt="Album cover test"
          />
          <h1 className="album-title">{playlistData.title}</h1>
          <h2 className="album-userName">{playlistData.userName} . </h2>
          <h3 className="album-userName">
            Date Created: {formatDate(playlistData.dateCreated)}
          </h3>
          {currentUser && data.publicPlaylist && data.emailAddress !== currentUser.email && (
            <button onClick={handleFollow} className="btn">
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      )}

      <div className="songs-container">
        <div className="header-row">
          <div className="header-info">#</div>
          <div className="header-info">Title</div>
          <div className="header-info">Album</div>
          <div className="header-info">Artist</div>
          <div className="header-info">Release Date</div>
          <div className="header-info">Duration</div>
        </div>
        {songsData &&
          songsData.map((song, index) => (
            <Link
              key={song.id}
              to={`/song/${song.id}`}
              className="playlist-link"
            >
              <div className="song-row" key={song.id}>
                <div className="song-info">{index + 1}</div>
                <div className="song-info">{song.title}</div>
                <div className="song-info">{song.album.title}</div>
                <div className="song-info">{song.artist.name}</div>
                <div className="song-info">{song.release_date}</div>
                <div className="song-info">{formatTime(song.duration)}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
