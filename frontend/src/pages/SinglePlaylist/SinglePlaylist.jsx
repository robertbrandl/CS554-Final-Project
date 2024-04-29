import "./SinglePlaylist.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
export const SinglePlaylist = () => {
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
    setError('');
    async function fetchData() {
      setLoading(true);
      try{
        const data = await axios.get(`/api/playlists/playlist/${id}`);
        setPlaylistData(data)
        setError("");
      }catch(e){
        setError(e.message);
      }
      setLoading(false);
    }
    fetchData()
  }, [id]);
  if (loading){
    return <div>Loading...</div>
  }
  else if (error) {
    return <div>Error: {error}</div>;
  }
  return <div>SinglePlaylist</div>;
};
