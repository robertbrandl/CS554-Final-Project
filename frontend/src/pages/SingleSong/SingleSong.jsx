import "./SingleSong.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
export const SingleSong = () => {
  const [songData, setSongData] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    async function fetchData() {
      const data = await axios.get(`/api/songs/song/${id}`);
      setSongData(data)
    }
    fetchData()
  }, [id]);
  return <div>SingleSong</div>;
};
