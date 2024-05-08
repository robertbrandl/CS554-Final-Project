import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ArtistsSongs.css";
import axios from "axios";
export const ArtistsSongs = ({ artistId }) => {
  const [error, setError] = useState("");
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    setError("");
    const fetchData = async () => {
      console.log("artistId = ", artistId);
      let response = null;
      try {
        response = await axios.get("http://localhost:3000/songs/artistsongs", {
          params: {
            artistId: String(artistId),
          },
        });
      } catch (e) {
        response = e;
      }
      if (response && response.status && response.status === 200) {
        // Update the playlists state with the received playlists

        setSongs(response.data.data);
        console.log("artists songs have been found");
        console.log(songs);
      } else {
        setError("Failed to fetch artists songs");
      }
    };

    fetchData();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="artist-songs">
      <h1 className="artist-song-heading">Artist's Other Songs</h1>
      {songs && (
        <div className="item-holder smaller">
          <ul>
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <li key={index}>
                  <Link className="linker" key={index} to={`/song/${song.id}`}>
                    <span>{song.title}</span>
                    <span className="genre">
                      Created By: {song.artist.name}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li>No Songs Found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
