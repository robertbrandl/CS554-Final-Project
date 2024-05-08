import "./FollowedPlaylists.css";
import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import axios from "axios";
export const FollowedPlaylists = () => {
  const { currentUser } = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [playlistStates, setPlaylistStates] = useState({});
  const [userId, setUserId] = useState("");
  const [sortItem, setSortItem] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedGenre, setSelectedGenre] = useState("");
  useEffect(() => {
    setError("");
    setErrorMessage("");
    let res = null;
    async function getUser() {
      let data = await axios.get("/api/users/account", {
        params: {
          email: currentUser.email,
        },
      });
      res = data.data;
      if (res && res._id) {
        setUserId(res._id);
      }
    }
    async function fetchAllData(genre) {
      setLoading(true);
      try {
        let { data } = await axios.get(`/api/playlists/followedplaylists`, {
          params: {
            email: currentUser.email,
          },
        });
        console.log(data);
        if (data && data.length > 0) {
          const updatedStates = {};
          for (let x of data) {
            if (
              res &&
              res.savedPlaylists &&
              res.savedPlaylists.includes(x._id.toString())
            ) {
              updatedStates[x._id] = true;
            } else if (res && res.savedPlaylists) {
              updatedStates[x._id] = false;
            }
          }
          setPlaylistStates((prevStates) => ({
            ...prevStates,
            ...updatedStates,
          }));
        }
        if (genre){
          data = data.filter((playlist) => playlist.genre == genre)
        }
        setPlaylistData(data);
        setError("");
      } catch (e) {
        setError(e.response.data.message || e.message);
      }
      setLoading(false);
    }
    async function fetchData(genre) {
      try {
        const { data } = await axios.get(
          `/api/playlists/searchfollowedbyname`,
          {
            params: {
              name: searchTerm.toLowerCase(),
              genre: genre.trim()
            },
          }
        );
        if (data && data.length > 0) {
          const updatedStates = {};
          for (let x of data) {
            if (
              res &&
              res.savedPlaylists &&
              res.savedPlaylists.includes(x._id.toString())
            ) {
              updatedStates[x._id] = true;
            } else if (res && res.savedPlaylists) {
              updatedStates[x._id] = false;
            }
          }
          setPlaylistStates((prevStates) => ({
            ...prevStates,
            ...updatedStates,
          }));
        }
        let pdata = [];
        if (data && data.length > 0) {
          // pdata = data.map((e) => e._source);
          pdata = data.map(({ _id, _source: { doc } }) => ({ _id, ...doc }));

        }
        console.log(pdata);
        setPlaylistData(pdata);
        setError("");
      } catch (e) {
        console.log(e)
        if (e.response.data.error){setErrorMessage(e.response.data.error)}
        else{
        setError(e.response.data.message ||e.message);}
      }
    }
    if (currentUser){
      getUser();}
    if (searchTerm && selectedGenre) {
      fetchData(selectedGenre);
    } else if (searchTerm) {
      fetchData(selectedGenre);
    }else if (selectedGenre) {
      fetchAllData(selectedGenre);
    }
    else{
      fetchAllData();
    }
  }, [searchTerm, selectedGenre]);
  useEffect(() => { 
    if (sortOrder == "asc" || sortOrder == "desc"){
      if (sortItem == "title" || sortItem == "userName" || sortItem == "dateCreated")
      setPlaylistData(sortedData());
    }
  }, [sortItem, sortOrder]); 

  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };
  const sortedData = () => {
    if (!playlistData) return [];
    return playlistData.sort((a, b) => {
      if (sortOrder === 'asc'){
        return a[sortItem].localeCompare(b[sortItem]);
      }else{
        return b[sortItem].localeCompare(a[sortItem]);
      }
    });
  };
  const handleSortItem = (e) => {
    setErrorMessage('');
    let trim = e.target.value.trim();
    if (trim !== "title" && trim !== "userName" && trim !== "dateCreated"){
      setErrorMessage("Error: Sorting must be by title, username, or date created.")
    }
    else{
      setSortItem(e.target.value.trim());
      sortedData()
    }
  };

  const handleSortOrder = (e) => {
    setErrorMessage('');
    let trim = e.target.value.trim();
    if (trim !== "asc" && trim !== "desc"){
      setErrorMessage("Error: Sorting order must be either ascending or descending.")
    }
    else{
      setSortOrder(e.target.value.trim())
      sortedData()
    }
  }
  
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  const handleSave = async (playlistId) => {
    setLoading(true);
    const isPlaylistSaved = playlistStates[playlistId];
    console.log(playlistStates);
    if (isPlaylistSaved === false) {
      try {
        const response = await axios.patch("/api/users/save", {
          email: currentUser.email,
          saveId: playlistId,
        });
      } catch (e) {
        setError(e.response.statusText || e.message);
      }
    } else {
      try {
        const response = await axios.patch("/api/users/unsave", {
          email: currentUser.email,
          unsaveId: playlistId,
        });
      } catch (e) {
        setError(e.response.statusText || e.message);
      }
    }
    setPlaylistStates((prevStates) => ({
      ...prevStates,
      [playlistId]: !isPlaylistSaved,
    }));
    setLoading(false);
  };
  const handleGenreChange = (e) => {
    setErrorMessage("");
    console.log(e.target.value)
    let trim = e.target.value.trim();
    if (!genres.includes(trim) || trim === "" || trim === "No Genre") {
      setErrorMessage("Error: Genre selected must be a value from the dropdown")
      if (!searchTerm){
        setSelectedGenre("");
      }
    }
    else{
      setSelectedGenre(e.target.value.trim());
    }
  };
  const genres = [
    "Rock",
    "Pop",
    "Hip Hop",
    "R&B",
    "Country",
    "Electronic",
    "Latin",
    "K-POP",
    "Classical",
    "Metal",
    "Alternative",
    "Folk",
    "Rap",
    "Gospel",
  ];

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div className="error-gen">Error: {error}</div>;
  }
  return (
    <div className="card">
      <h1>View and Search Through Playlists from Your Followed Users</h1>
      <br />
      {errorMessage && <div className="error-gen">{errorMessage}</div>}
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        name="formName"
        className="center"
      >
        <label>
          <input
            autoComplete="off"
            type="text"
            name="searchTerm"
            value={searchTerm}
            onChange={handleChange}
            autoFocus
            className="inpclass"
            placeholder="Search for a playlist..."
          />
        </label>
      </form>
      <br />
      <div className="sort-selector">
        <label>
          Sort by:
          <select value={sortItem} onChange={handleSortItem}>
            <option value="title">Title</option>
            <option value="userName">Username</option>
            <option value="dateCreated">Date Created</option>
          </select>
        </label>
        <label>
          Order:
          <select value={sortOrder} onChange={handleSortOrder}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        </div>
        <br />
        <div className="filter-selector">
        <label>
          Filter by Genre:
          <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Select Genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
            <option value="No Genre">No Genre</option>
          </select>
        </label>
      </div>
      <br />
      <div className="item-holder">
        {playlistData && playlistData.length > 0 ? (
          <ul>
            {playlistData.map((playlist, index) => (
              <li key={index}>
                <Link className="linker" to={`/playlist/${playlist._id}`}>
                  <span>{playlist.title}</span>
                  <span className="created-by">
                    Created By: {playlist.userName}
                  </span>
                  <span className="genre">
                    {formatDate(playlist.dateCreated)}
                  </span>
                  <span className="genre">Genre: {playlist.genre}</span>
                </Link>
                {currentUser && playlist.userId !== userId && (
                  <button
                    onClick={() => handleSave(playlist._id)}
                    className="save-button2"
                  >
                    {playlistStates[playlist._id]
                      ? "Unsave Playlist"
                      : "Save Playlist"}
                  </button>
                )}
                <br/>
                <br/>
              </li>
            ))}
          </ul>
        ) : (
          <div>No playlists found</div>
        )}
      </div>
    </div>
  );
};
