import "./SingleSong.css";
import { useState, useEffect } from "react";
import axios from "axios";
export const SingleSong = ({ id }) => {
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/song/${id}`)
      .then((res) => setSongData(res.data));
  }, [id]);
  return <div>SingleSong</div>;
};
