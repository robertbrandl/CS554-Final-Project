import "./GenPlaylists.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
export const GenPlaylists = () => {
  const {currentUser} = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try{
        const {data} = await axios.get(`/api/playlists/searchbyname`, {params: {
          name: searchTerm
      }});
        let pdata = data.map((e) => e._source);
        console.log(pdata)
        setPlaylistData(pdata)
        setError("");
      }catch(e){
        setError(e.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [searchTerm])
  useEffect(() => {
    setError('');
    async function fetchData() {
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
    fetchData()
  }, []);
  const handleChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
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
      <form
        method='POST'
        onSubmit={(e) => {
          e.preventDefault();
        }}
        name='formName'
        className='center'
      >
        <label>
          <span>Search for a Playlist by Name: </span>
          <input
            autoComplete='off'
            type='text'
            name='searchTerm'
            value={searchTerm}
            onChange={handleChange}
          />
        </label>
      </form>
      {playlistData && playlistData.length > 0 ? 
      playlistData.map((e) =><div>{e.name}</div>) : <div>No playlists found</div>}
    </div>
  );
}
