import "./GenPlaylists.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate, Link} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
export const GenPlaylists = () => {
  const {currentUser} = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [playlistStates, setPlaylistStates] = useState({});
  useEffect(() => {
    setError('');
    let res = null;
    async function getUser(){
      let data = await axios.get('/api/users/account', {
        params: {
          email: currentUser.email
        }
      });
      res = data.data
    }
    async function fetchAllData() {
      setLoading(true);
      try{
        const {data} = await axios.get(`/api/playlists/allplaylists`);
        console.log(data)
        if (data && data.length > 0) {
          const updatedStates = {};
          for (let x of data) {
            if (res && res.savedPlaylists && res.savedPlaylists.includes(x._id.toString())) {
              updatedStates[x._id] = true;
            }
            else if (res && res.savedPlaylists){
              updatedStates[x._id] = false;
            }
          }
          setPlaylistStates(prevStates => ({
            ...prevStates,
            ...updatedStates
          }));
        }
        setPlaylistData(data)
        setError("");
      }catch(e){
        setError(e.message);
      }
      setLoading(false);
    }
    async function fetchData() {
      //setLoading(true);
      try{
        const {data} = await axios.get(`/api/playlists/searchbyname`, {params: {
          name: searchTerm
      }});
      console.log(data)
      if (data && data.length > 0) {
        const updatedStates = {};
        for (let x of data) {
          if (res && res.savedPlaylists && res.savedPlaylists.includes(x._id.toString())) {
            updatedStates[x._id] = true;
          }
          else if (res && res.savedPlaylists){
            updatedStates[x._id] = false;
          }
        }
        setPlaylistStates(prevStates => ({
          ...prevStates,
          ...updatedStates
        }));
      }
        let pdata = []
        if(data && data.length > 0){
          pdata = data.map((e) => e._source);
        }
        console.log(pdata)
        setPlaylistData(pdata)
        setError("");
      }catch(e){
        setError(e.message);
      }
      //setLoading(false);
    }
    getUser();
    if (searchTerm){
      fetchData();
    }
    else{
      fetchAllData();
    }
  }, [searchTerm])
  
  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };
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
    if (isPlaylistSaved === false){
      try{
      const response = await axios.patch('/api/users/save', {
        email: currentUser.email,
        saveId: playlistId
      });
      }catch(e){
        setError(e.response.statusText || e.message)
      }
    }
    else{
      try{
      const response = await axios.patch('/api/users/unsave', {
        email: currentUser.email,
        unsaveId: playlistId
      });
      }catch(e){
        setError(e.response.statusText || e.message)
      }
    }
    setPlaylistStates(prevStates => ({
      ...prevStates,
      [playlistId]: !isPlaylistSaved
    }));
    setLoading(false);
  };

  if (loading){
    return <div>Loading...</div>
  }
  else if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className='card'>
      <h1>View and Search Through All Playlists</h1>
      <br />
      <form
        method='POST'
        onSubmit={(e) => {
          e.preventDefault();
        }}
        name='formName'
        className='center'
      >
        <label>
          <input
            autoComplete='off'
            type='text'
            name='searchTerm'
            value={searchTerm}
            onChange={handleChange}
            autoFocus
            className="inpclass"
            placeholder="Search for a playlist..."
          />
        </label>
      </form>
      <br />
      {playlistData && playlistData.length > 0 ? (
        <ul>
          {playlistData.map((playlist) => (
            <li key={playlist._id}>
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
              {currentUser && playlist.userName !== currentUser.displayName && (
                <button onClick={() => handleSave(playlist._id)} className="save-button2">
                  {playlistStates[playlist._id] ? 'Unsave Playlist' : 'Save Playlist'}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>No playlists found</div>
      )}

    </div>
  );
}
