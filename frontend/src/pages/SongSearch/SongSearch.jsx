import "./SongSearch.css";
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../firebase/Auth';
import { Link } from "react-router-dom";
import axios from 'axios';

export const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const isLoggedIn = useContext(AuthContext);

  const searchSong = async () => {
    try {
      let response;
      response = await axios.get(`http://localhost:3000/songs/search/${query}`);
      console.log(response.data.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching for songs:', error);
    }
  };

  const saveSong = (song) => {
    console.log('Saved song with Name:', song.name);
  };

  return (
    <div className="song-search-page">
      <h1>Song Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs..."
      />
      <button onClick={searchSong}>Search</button>
      <ul>
        {searchResults.map((song) => (
          <li key={song.id}>
            <div>
              <Link to={`/song/${song.id}`}>
              <h3>{song.title}</h3>
              <p>{song.artist.name}</p>
              </Link>
              {isLoggedIn.currentUser && (
                <button onClick={() => saveSong(song)}>Save</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
