import "./UserAccount.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import axios from "axios";
export const UserAccount = () => {
  const {currentUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({})
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const {data} = await axios.get('/api/users/account', {
          params: {
            email: currentUser.email
          }
        });
        setData(data);
        console.log(data)
        console.log(data.profileImg)
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);
  
  if (loading){
    return <div>Loading...</div>
  }
  return (
    <div className='card'>
      <h1>Your Account</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.emailAddress}</p>
      <div>
        <img src={data.profileImg} alt="Profile Image" />
      </div>
      {data.publicPlaylist ? <>Your playlists and account is public!</> : <>Your playlists and account is private. This means you cannot be followed by other users.</>}
    </div>
  );
}
