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
  useEffect(() => {
    setError('');
    async function fetchAllData() {
      setLoading(true);
      try{
        const {data} = await axios.get(`/api/playlists/allplaylists`);
        console.log(data)
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

  if (loading){
    return <div>Loading...</div>
  }
  else if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className='card'>
      <h1>View and Search Through All Playlists</h1>
      <form
        method='POST'
        onSubmit={(e) => {
          e.preventDefault();
        }}
        name='formName'
        className='center'
      >
        <label>
          <span>Search for a Playlist by Title: </span>
          <input
            autoComplete='off'
            type='text'
            name='searchTerm'
            value={searchTerm}
            onChange={handleChange}
            autoFocus
          />
        </label>
      </form>
      {playlistData && playlistData.length > 0 ? 
      playlistData.map((playlist) => (
        <li key={playlist._id}>
          <Link
            className="linker"
            to={`/playlist/${playlist._id}`}
          >
            <span>{playlist.title}</span>
            <span className="created-by">
              Created By: {playlist.userName}
            </span>

            <span className="genre">
              {formatDate(playlist.dateCreated)}
            </span>
            <span className="genre">Genre: {playlist.genre}</span>
          </Link>
        </li>
      ))
      : <div>No playlists found</div>}
    </div>
  );
}
