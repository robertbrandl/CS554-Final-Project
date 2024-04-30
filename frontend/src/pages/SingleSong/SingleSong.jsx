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
        const data = await axios.get(`http://localhost:3000/songs/song/${id}`);
        console.log("data =",data)
        setSongData(data.data);
        
        setErrorMessage('');
      }catch(e){
        setErrorMessage(e.message)
      }
      setLoading(false);
    }
    fetchData()
  }, [id]);


  function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  if (loading){
    return <div>Loading...</div>
  }
  else if (errorMessage){
    return <div>Error: {errorMessage}</div>
  }
 else if (!songData) {
  return <div>No song found with ID: {id}</div>;
}
  return (<>
  <div className="single-song">{songData.title && <h1>{songData.title}</h1>}</div> 
  {songData.artist.name &&  <h2>By : {songData.artist.name}</h2>}
  {songData.artist.picture_medium && <img src={songData.artist.picture_medium} alt={songData.artist.picture_medium} className="artist-image"/>}
  {songData.release_date &&  <h2>Release Date: {songData.release_date}</h2>}
  {songData.album.cover_medium && <img src={songData.album.cover_medium} alt={songData.album.cover_medium} />}
  {songData.duration && <h3>Duration : {secondsToMinutes(songData.duration)}</h3>}
  {songData.explicit_lyrics ? <h3 className="explicit">Explicit</h3>: <h3>Non-Explicit</h3>}
  {songData.preview &&   <video controls={true}  className="preview"><source src={songData.preview} type="audio/mpeg"/></video>}
  {songData.album && <h3>Album : {songData.album.title}</h3>}
  
 


  </>

  )
  
 
};
