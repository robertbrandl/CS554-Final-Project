import "./PublicUser.css";
import React, {useContext, useState, useEffect} from 'react';
import {Navigate, useParams, Link} from 'react-router-dom';
import {AuthContext} from '../../firebase/Auth';
import { AccountPlaylists } from "../../components/AccountPlaylists/AccountPlaylists";
import axios from "axios";

export const PublicUser = () => {
  const {currentUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({})
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  console.log(currentUser)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const {data} = await axios.get('/api/users/profile', {
          params: {
            userId: id
          }
        });
        const {data: loggedInUser} = await axios.get('/api/users/account', {
            params: {
              email: currentUser.email
            }
          });
        console.log(loggedInUser)
        console.log(id)
        if (loggedInUser.followedUsers && loggedInUser.followedUsers.includes(id.toString())) {
            setIsFollowing(true);
        }
        let playlists = data.playlists;
        setData(data);
        console.log(data)
        setErrorMessage('');
        setLoading(false);
      } catch (e) {
        console.log(e)
        if (e.response.data.error){
            setErrorMessage(e.response.data.error);
        }
        else if (e.response.statusText){
            setErrorMessage("Error: " + e.response.statusText);
        }
        else{
            setErrorMessage(e.message);
        }
        setLoading(false);
      }
    }
    if (currentUser){
    fetchData();
    }
  }, [id]);

  const handleFollow = async () => {
    setLoading(true);
    console.log(isFollowing)
    if (isFollowing === false){
      const response = await axios.patch('/api/users/follow', {
        email: currentUser.email,
        followId: id
      });
    }
    else{
      const response = await axios.patch('/api/users/unfollow', {
        email: currentUser.email,
        unfollowId: id
      });
    }
    setIsFollowing(!isFollowing);
    setLoading(false);
  };
  
  if (loading){
    return <div>Loading...</div>
  }
  else if (errorMessage){
    return <div>{errorMessage}</div>
  }
  if (!currentUser){
    return <div className="not-current-user"><br />You must be logged in to access this page!</div>
  }
  return (
    <>
    <div className='profile'>
      <h1>User Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.emailAddress} {data.publicPlaylist}</p>
      {currentUser && data.publicPlaylist && data.emailAddress !== currentUser.email && (
        <button onClick={handleFollow} className="btn">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
    <br />
    <br />
    <br />
    <h2>Playlists:</h2>
    <AccountPlaylists user={{email: data.emailAddress}} />
    </>
  );
}
