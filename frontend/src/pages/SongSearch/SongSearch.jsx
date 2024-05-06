import "./SongSearch.css";
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../firebase/Auth';
import { Link } from "react-router-dom";
import axios from 'axios';

export const SongSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState({
    artist: false,
    album: false,
    track: true, 
    label: false
  });
  const [searchTerms, setSearchTerms] = useState({
    artist: '',
    album: '',
    label: ''
  });
  const isLoggedIn = useContext(AuthContext);

  const searchSong = async () => {
    setErrorMessage('');
    try {
      if (!options.artist && !options.album && !options.track && !options.label) {
        throw new Error('Must supply at least one parameter');
      }

      let response;
      let params = "";
      if (options.track) params += `track:"${searchTerms.track.toLowerCase().trim()}"`;
      if (options.artist) params += ` artist:"${searchTerms.artist.toLowerCase().trim()}"`;
      if (options.album) params += ` album:${searchTerms.album.toLowerCase().trim()}`;
      if (options.label) params += ` label:${searchTerms.label.toLowerCase().trim()}`;

      response = await axios.get(`http://localhost:3000/songs/search/${params}`);
      
      if (response.data.data.length === 0) {
        setErrorMessage('No results found');
      } else {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      if (error.message === 'Must supply at least one parameter') {
        setErrorMessage('Error: Must supply at least one parameter');
      } else if (error.response && error.response.data.message) {
        setErrorMessage('Error searching for songs: ' + error.response.data.message);
      } else if (error.response && error.response.statusText) {
        setErrorMessage('Error searching for songs: ' + error.response.statusText);
      } else {
        setErrorMessage('Error searching for songs: ' + error.message);
      }
    }
  };

  const saveSong = (song) => {
    console.log('Saved song with Name:', song.name);
  };

  const handleOptionChange = (option) => {
    setOptions({ ...options, [option]: !options[option] });
    setSearchTerms({ ...searchTerms, [option]: '' });
  };

  const handleSearchTermChange = (option, value) => {
    setSearchTerms({ ...searchTerms, [option]: value });
  };

  return (
    <div className="song-search-page">
      <h1>Song Search</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <label>
          <input
            type="checkbox"
            checked={options.track}
            onChange={() => handleOptionChange('track')}
          />
          Track
        </label>
        {options.track && (
          <input
            type="text"
            value={searchTerms.track}
            onChange={(e) => handleSearchTermChange("track", e.target.value)}
            placeholder="Search for track..."
          />
        )}
        <label>
          <input
            type="checkbox"
            checked={options.artist}
            onChange={() => handleOptionChange('artist')}
          />
          Artist
        </label>
        {options.artist && (
          <input
            type="text"
            value={searchTerms.artist}
            onChange={(e) => handleSearchTermChange('artist', e.target.value)}
            placeholder="Search for artist..."
          />
        )}
        <label>
          <input
            type="checkbox"
            checked={options.album}
            onChange={() => handleOptionChange('album')}
          />
          Album
        </label>
        {options.album && (
          <input
            type="text"
            value={searchTerms.album}
            onChange={(e) => handleSearchTermChange('album', e.target.value)}
            placeholder="Search for album..."
          />
        )}
        <label>
          <input
            type="checkbox"
            checked={options.label}
            onChange={() => handleOptionChange('label')}
          />
          Label
        </label>
        {options.label && (
          <input
            type="text"
            value={searchTerms.label}
            onChange={(e) => handleSearchTermChange('label', e.target.value)}
            placeholder="Search for label..."
          />
        )}
      </div>
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