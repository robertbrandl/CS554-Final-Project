import "./SinglePlaylist.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
export const SinglePlaylist = () => {
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
    setError('');
    async function fetchData() {
      try{
        const data = await axios.get(`/api/playlists/playlist/${id}`);
        setPlaylistData(data)
      }catch(e){
        setError(e.message);
      }
    }
    fetchData()
  }, [id]);
  if (error) {
    return <div>Error: {error}</div>;
  }
  return <div>SinglePlaylist</div>;
};
