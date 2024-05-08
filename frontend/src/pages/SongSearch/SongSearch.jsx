import "./SongSearch.css";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import axios from "axios";
import { AddToPlaylistButton } from "../../components/AddToPlaylistButton/AddToPlaylistButton";

export const SongSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [options, setOptions] = useState({
    artist: false,
    album: false,
    track: true,
    label: false,
  });
  const [searchTerms, setSearchTerms] = useState({
    track: "",
    artist: "",
    album: "",
    label: "",
  });
  const isLoggedIn = useContext(AuthContext);

  const searchSong = async () => {
    setErrorMessage("");
    try {
      if (
        !options.artist &&
        !options.album &&
        !options.track &&
        !options.label
      ) {
        throw new Error("Must supply at least one parameter");
      }
      let response;
      let params = "";
      if (options.track) {
        if (typeof searchTerms.track !== "string") {
          throw new Error("Track input must be a string");
        } else if (searchTerms.track.length > 100) {
          throw new Error("Track input must be less than or equal to 100 characters");
        }
        params += `track:"${searchTerms.track.toLowerCase().trim()}"`;
      }
      if (options.artist) {
        if (typeof searchTerms.artist !== "string") {
          throw new Error("Artist input must be a string");
        } else if (searchTerms.artist.length > 100) {
          throw new Error("Artist input must be less than or equal to 100 characters");
        }
        params += ` artist:"${searchTerms.artist.toLowerCase().trim()}"`;
      }
      if (options.album) {
        if (typeof searchTerms.album !== "string") {
          throw new Error("Album input must be a string");
        } else if (searchTerms.album.length > 100) {
          throw new Error("Album input must be less than or equal to 100 characters");
        }
        params += ` album:"${searchTerms.album.toLowerCase().trim()}"`;
      }
      if (options.label) {
        if (typeof searchTerms.label !== "string") {
          throw new Error("Label input must be a string");
        } else if (searchTerms.label.length > 100) {
          throw new Error("Label input must be less than or equal to 100 characters");
        }
        params += ` label:"${searchTerms.label.toLowerCase().trim()}"`;
      }
      response = await axios.get(
        `http://localhost:3000/songs/search/${params}`
      );

      if (response.data.data.length === 0) {
        setErrorMessage("No results found");
      } else {
        setSearchResults(response.data.data.slice(0, 10));
      }
    } catch (error) {
      if (error.message === "Must supply at least one parameter") {
        setErrorMessage("Error: Must supply at least one parameter");
      } else if (error.response && error.response.data.message) {
        setErrorMessage(
          "Error searching for songs: " + error.response.data.message
        );
      } else if (error.response && error.response.statusText) {
        setErrorMessage(
          "Error searching for songs: " + error.response.statusText
        );
      } else {
        setErrorMessage("Error searching for songs: " + error.message);
      }
    }
  };

  const handleOptionChange = (option) => {
    setOptions({ ...options, [option]: !options[option] });
    setSearchTerms({ ...searchTerms, [option]: "" });
  };

  const handleSearchTermChange = (option, value) => {
    setSearchTerms({ ...searchTerms, [option]: value });
  };

  return (
    <div className="song-search-page">
      <h1>Song Search</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <br />
      <div>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={options.track}
            onChange={() => handleOptionChange("track")}
          />
          Track
        </label>
        {options.track && (
          <div className="search-row">
            <input
              type="text"
              value={searchTerms.track}
              onChange={(e) => handleSearchTermChange("track", e.target.value)}
              placeholder="Search for track..."
            />
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={options.artist}
            onChange={() => handleOptionChange("artist")}
          />
          Artist
        </label>
        {options.artist && (
          <div className="search-row">
            <input
              type="text"
              value={searchTerms.artist}
              onChange={(e) => handleSearchTermChange("artist", e.target.value)}
              placeholder="Search for artist..."
            />
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={options.album}
            onChange={() => handleOptionChange("album")}
          />
          Album
        </label>
        {options.album && (
          <div className="search-row">
            <input
              type="text"
              value={searchTerms.album}
              onChange={(e) => handleSearchTermChange("album", e.target.value)}
              placeholder="Search for album..."
            />
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={options.label}
            onChange={() => handleOptionChange("label")}
          />
          Label
        </label>
        {options.label && (
          <div className="search-row">
            <input
              type="text"
              value={searchTerms.label}
              onChange={(e) => handleSearchTermChange("label", e.target.value)}
              placeholder="Search for label..."
            />
          </div>
        )}
      </div>
      <button onClick={searchSong}>Search</button>
      {!errorMessage && <ul>
        {searchResults.map((song) => (
          <li key={song.id}>
            <div>
              <Link to={`/song/${song.id}`}>
                <h3>{song.title}</h3>
                <p>{song.artist.name}</p>
              </Link>
              {isLoggedIn.currentUser && <AddToPlaylistButton id={song.id} />}
            </div>
          </li>
        ))}
      </ul>}
    </div>
  );
};
