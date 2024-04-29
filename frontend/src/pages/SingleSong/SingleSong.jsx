import "./SingleSong.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
export const SingleSong = () => {
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try{
        const data = await axios.get(`/api/songs/song/${id}`);
        setSongData(data);
        setErrorMessage('');
      }catch(e){
        setErrorMessage(e.message)
      }
      setLoading(false);
    }
    fetchData()
  }, [id]);
  if (loading){
    return <div>Loading...</div>
  }
  else if (errorMessage){
    return <div>Error: {errorMessage}</div>
  }
  return <div>SingleSong</div>;
};
